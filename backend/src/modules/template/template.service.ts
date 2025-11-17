import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  /**
   * 创建模板
   */
  async create(
    createTemplateDto: CreateTemplateDto,
    developerId: number,
  ): Promise<Template> {
    // 检查代码是否已存在
    const existing = await this.templateRepository.findOne({
      where: { code: createTemplateDto.code },
    });

    if (existing) {
      throw new BadRequestException('模板代码已存在');
    }

    const template = this.templateRepository.create({
      ...createTemplateDto,
      developerId,
      status: TemplateStatus.DRAFT,
    });

    return this.templateRepository.save(template);
  }

  /**
   * 查询所有模板
   */
  async findAll(status?: TemplateStatus): Promise<Template[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return this.templateRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 查询已审核通过的模板（模板市场）
   */
  async findMarket(): Promise<Template[]> {
    return this.templateRepository.find({
      where: { status: TemplateStatus.APPROVED },
      order: { downloadCount: 'DESC', ratingScore: 'DESC' },
    });
  }

  /**
   * 查询模板详情
   */
  async findOne(id: number): Promise<Template> {
    const template = await this.templateRepository.findOne({ where: { id } });

    if (!template) {
      throw new NotFoundException('模板不存在');
    }

    return template;
  }

  /**
   * 更新模板
   */
  async update(
    id: number,
    updateTemplateDto: UpdateTemplateDto,
    developerId: number,
  ): Promise<Template> {
    const template = await this.findOne(id);

    // 验证开发者权限
    if (template.developerId !== developerId) {
      throw new BadRequestException('无权限操作此模板');
    }

    Object.assign(template, updateTemplateDto);
    return this.templateRepository.save(template);
  }

  /**
   * 删除模板
   */
  async remove(id: number, developerId: number): Promise<void> {
    const template = await this.findOne(id);

    // 验证开发者权限
    if (template.developerId !== developerId) {
      throw new BadRequestException('无权限操作此模板');
    }

    await this.templateRepository.softRemove(template);
  }

  /**
   * 提交审核
   */
  async submitForReview(id: number, developerId: number): Promise<Template> {
    const template = await this.findOne(id);

    if (template.developerId !== developerId) {
      throw new BadRequestException('无权限操作此模板');
    }

    if (template.status !== TemplateStatus.DRAFT) {
      throw new BadRequestException('只能提交草稿模板进行审核');
    }

    template.status = TemplateStatus.PENDING;
    return this.templateRepository.save(template);
  }

  /**
   * 审核模板
   */
  async audit(
    id: number,
    approved: boolean,
    comment?: string,
  ): Promise<Template> {
    const template = await this.findOne(id);

    if (template.status !== TemplateStatus.PENDING) {
      throw new BadRequestException('模板不在待审核状态');
    }

    template.status = approved ? TemplateStatus.APPROVED : TemplateStatus.REJECTED;
    return this.templateRepository.save(template);
  }

  /**
   * 下架模板
   */
  async offline(id: number): Promise<Template> {
    const template = await this.findOne(id);
    template.status = TemplateStatus.OFFLINE;
    return this.templateRepository.save(template);
  }

  /**
   * 增加下载次数
   */
  async incrementDownload(id: number): Promise<void> {
    await this.templateRepository.increment({ id }, 'downloadCount', 1);
  }

  /**
   * 评分
   */
  async rate(id: number, score: number): Promise<void> {
    if (score < 1 || score > 5) {
      throw new BadRequestException('评分必须在1-5之间');
    }

    const template = await this.findOne(id);

    // 计算新的平均分
    const totalScore = template.ratingScore * template.ratingCount + score;
    const newCount = template.ratingCount + 1;
    const newScore = Math.round((totalScore / newCount) * 100) / 100;

    template.ratingScore = newScore;
    template.ratingCount = newCount;

    await this.templateRepository.save(template);
  }
}
