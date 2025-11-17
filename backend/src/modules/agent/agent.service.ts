import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Agent, AgentStatus } from './entities/agent.entity';
import { AgentCommission, CommissionStatus } from './entities/agent-commission.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { QueryAgentDto } from './dto/query-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(AgentCommission)
    private readonly commissionRepository: Repository<AgentCommission>,
  ) {}

  /**
   * 创建代理商
   */
  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    // 检查代理商编号是否已存在
    const existingAgent = await this.agentRepository.findOne({
      where: { code: createAgentDto.code },
    });
    if (existingAgent) {
      throw new BadRequestException('代理商编号已存在');
    }

    // 如果有上级代理商，验证上级代理商是否存在
    if (createAgentDto.parentId) {
      const parentAgent = await this.agentRepository.findOne({
        where: { id: createAgentDto.parentId },
      });
      if (!parentAgent) {
        throw new NotFoundException('上级代理商不存在');
      }

      // 检查区域冲突
      await this.validateRegion(createAgentDto, parentAgent);
    }

    const agent = this.agentRepository.create(createAgentDto);
    return this.agentRepository.save(agent);
  }

  /**
   * 验证代理区域是否冲突
   */
  private async validateRegion(dto: CreateAgentDto | UpdateAgentDto, parentAgent?: Agent): Promise<void> {
    // 检查同级代理商是否已有相同区域
    const query: any = { status: AgentStatus.ACTIVE };

    if (dto['parentId']) {
      query.parentId = dto['parentId'];
    }

    if (dto.regionProvince) {
      query.regionProvince = dto.regionProvince;

      if (dto.regionCity) {
        query.regionCity = dto.regionCity;

        if (dto.regionDistrict) {
          query.regionDistrict = dto.regionDistrict;
        }
      }
    }

    const conflictAgent = await this.agentRepository.findOne({ where: query });
    if (conflictAgent) {
      throw new BadRequestException('该区域已有代理商负责');
    }
  }

  /**
   * 查询代理商列表
   */
  async findAll(queryDto: QueryAgentDto): Promise<{ data: Agent[]; total: number }> {
    const { page = 1, pageSize = 10, level, parentId, keyword, province, city } = queryDto;

    const queryBuilder = this.agentRepository
      .createQueryBuilder('agent')
      .leftJoinAndSelect('agent.parent', 'parent');

    if (level) {
      queryBuilder.andWhere('agent.level = :level', { level });
    }

    if (parentId !== undefined) {
      if (parentId === null || parentId === 0) {
        queryBuilder.andWhere('agent.parentId IS NULL');
      } else {
        queryBuilder.andWhere('agent.parentId = :parentId', { parentId });
      }
    }

    if (keyword) {
      queryBuilder.andWhere('(agent.name LIKE :keyword OR agent.code LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    if (province) {
      queryBuilder.andWhere('agent.regionProvince = :province', { province });
    }

    if (city) {
      queryBuilder.andWhere('agent.regionCity = :city', { city });
    }

    queryBuilder.orderBy('agent.createdAt', 'DESC');

    const [data, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data, total };
  }

  /**
   * 获取代理商详情
   */
  async findOne(id: number): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!agent) {
      throw new NotFoundException('代理商不存在');
    }

    return agent;
  }

  /**
   * 更新代理商
   */
  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);

    // 如果修改了上级代理商，验证新上级
    if (updateAgentDto.parentId && updateAgentDto.parentId !== agent.parentId) {
      if (updateAgentDto.parentId === id) {
        throw new BadRequestException('不能将自己设为上级代理商');
      }

      const parentAgent = await this.agentRepository.findOne({
        where: { id: updateAgentDto.parentId },
      });
      if (!parentAgent) {
        throw new NotFoundException('上级代理商不存在');
      }

      // 检查是否会形成循环引用
      await this.checkCircularReference(id, updateAgentDto.parentId);
    }

    // 如果修改了区域，验证区域冲突
    if (updateAgentDto.regionProvince || updateAgentDto.regionCity || updateAgentDto.regionDistrict) {
      await this.validateRegion(updateAgentDto);
    }

    Object.assign(agent, updateAgentDto);
    return this.agentRepository.save(agent);
  }

  /**
   * 检查循环引用
   */
  private async checkCircularReference(agentId: number, parentId: number): Promise<void> {
    let currentParentId = parentId;
    const visited = new Set<number>([agentId]);

    while (currentParentId) {
      if (visited.has(currentParentId)) {
        throw new BadRequestException('不能形成循环引用');
      }

      visited.add(currentParentId);

      const parent = await this.agentRepository.findOne({
        where: { id: currentParentId },
        select: ['parentId'],
      });

      currentParentId = parent?.parentId;
    }
  }

  /**
   * 删除代理商
   */
  async remove(id: number): Promise<void> {
    const agent = await this.findOne(id);

    // 检查是否有下级代理商
    if (agent.children && agent.children.length > 0) {
      throw new BadRequestException('该代理商下还有下级代理商，无法删除');
    }

    // 检查是否有客户
    if (agent.totalCustomers > 0) {
      throw new BadRequestException('该代理商下还有客户，无法删除');
    }

    await this.agentRepository.remove(agent);
  }

  /**
   * 更新代理商状态
   */
  async updateStatus(id: number, status: AgentStatus): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.status = status;
    return this.agentRepository.save(agent);
  }

  /**
   * 获取代理商的客户列表（从租户表获取）
   */
  async getCustomers(agentId: number, page: number = 1, pageSize: number = 10): Promise<any> {
    // 这里需要关联 tenants 表，暂时返回空数组
    // 实际实现需要在 tenant 模块中添加 agent_id 字段
    return {
      data: [],
      total: 0,
    };
  }

  /**
   * 获取代理商佣金记录
   */
  async getCommissions(
    agentId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: AgentCommission[]; total: number }> {
    const [data, total] = await this.commissionRepository.findAndCount({
      where: { agentId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total };
  }

  /**
   * 创建佣金记录
   */
  async createCommission(data: {
    agentId: number;
    orderId?: number;
    tenantId: number;
    amount: number;
  }): Promise<AgentCommission> {
    const agent = await this.findOne(data.agentId);

    const commission = this.commissionRepository.create({
      agentId: data.agentId,
      orderId: data.orderId,
      tenantId: data.tenantId,
      amount: data.amount,
      commissionRate: agent.commissionRate,
      commissionAmount: (data.amount * agent.commissionRate) / 100,
      status: CommissionStatus.PENDING,
    });

    const savedCommission = await this.commissionRepository.save(commission);

    // 更新代理商统计数据
    agent.totalRevenue = Number(agent.totalRevenue) + Number(data.amount);
    agent.totalCommission = Number(agent.totalCommission) + Number(savedCommission.commissionAmount);
    await this.agentRepository.save(agent);

    // 如果有上级代理商，递归创建上级佣金
    if (agent.parentId) {
      const parentAgent = await this.findOne(agent.parentId);
      await this.createCommission({
        agentId: parentAgent.id,
        orderId: data.orderId,
        tenantId: data.tenantId,
        amount: Number(savedCommission.commissionAmount),
      });
    }

    return savedCommission;
  }

  /**
   * 结算佣金
   */
  async settleCommission(commissionId: number): Promise<AgentCommission> {
    const commission = await this.commissionRepository.findOne({
      where: { id: commissionId },
    });

    if (!commission) {
      throw new NotFoundException('佣金记录不存在');
    }

    if (commission.status !== CommissionStatus.PENDING) {
      throw new BadRequestException('该佣金记录已处理');
    }

    commission.status = CommissionStatus.PAID;
    commission.settledAt = new Date();

    return this.commissionRepository.save(commission);
  }

  /**
   * 获取代理商统计数据
   */
  async getStats(agentId: number): Promise<any> {
    const agent = await this.findOne(agentId);

    // 获取下级代理商数量
    const childrenCount = await this.agentRepository.count({
      where: { parentId: agentId },
    });

    // 获取待结算佣金
    const pendingCommissions = await this.commissionRepository
      .createQueryBuilder('commission')
      .select('SUM(commission.commissionAmount)', 'total')
      .where('commission.agentId = :agentId', { agentId })
      .andWhere('commission.status = :status', { status: CommissionStatus.PENDING })
      .getRawOne();

    // 获取本月统计
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyStats = await this.commissionRepository
      .createQueryBuilder('commission')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(commission.commissionAmount)', 'total')
      .where('commission.agentId = :agentId', { agentId })
      .andWhere('commission.createdAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    return {
      totalCustomers: agent.totalCustomers,
      activeCustomers: agent.activeCustomers,
      totalRevenue: agent.totalRevenue,
      totalCommission: agent.totalCommission,
      pendingCommission: pendingCommissions?.total || 0,
      childrenCount,
      monthlyOrders: monthlyStats?.count || 0,
      monthlyCommission: monthlyStats?.total || 0,
    };
  }

  /**
   * 获取代理商层级树
   */
  async getTree(parentId?: number): Promise<Agent[]> {
    const where: any = {};

    if (parentId === undefined) {
      where.parentId = IsNull();
    } else {
      where.parentId = parentId;
    }

    const agents = await this.agentRepository.find({
      where,
      relations: ['children'],
      order: { createdAt: 'ASC' },
    });

    // 递归加载子节点
    for (const agent of agents) {
      if (agent.children && agent.children.length > 0) {
        for (const child of agent.children) {
          child.children = await this.getTree(child.id);
        }
      }
    }

    return agents;
  }
}
