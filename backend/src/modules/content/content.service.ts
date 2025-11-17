import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Content, ContentStatus } from './entities/content.entity';
import { ContentVersion } from './entities/content-version.entity';
import { ContentAudit, AuditStatus } from './entities/content-audit.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { QueryContentDto } from './dto/query-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(ContentVersion)
    private readonly versionRepository: Repository<ContentVersion>,
    @InjectRepository(ContentAudit)
    private readonly auditRepository: Repository<ContentAudit>,
  ) {}

  /**
   * 创建内容
   */
  async create(
    createContentDto: CreateContentDto,
    tenantId: number,
    userId: number,
  ): Promise<Content> {
    // 检查slug是否已存在
    const existing = await this.contentRepository.findOne({
      where: { tenantId, slug: createContentDto.slug },
    });

    if (existing) {
      throw new BadRequestException('URL别名已存在');
    }

    // 创建内容
    const content = this.contentRepository.create({
      ...createContentDto,
      tenantId,
      authorId: userId,
      status: createContentDto.status || ContentStatus.DRAFT,
      version: 1,
    });

    const savedContent = await this.contentRepository.save(content);

    // 创建初始版本
    await this.createVersion(savedContent, userId, '初始版本');

    return savedContent;
  }

  /**
   * 查询内容列表
   */
  async findAll(
    tenantId: number,
    query: QueryContentDto,
  ): Promise<{ data: Content[]; total: number }> {
    const { page, pageSize, status, categoryId, keyword, language } = query;

    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .where('content.tenantId = :tenantId', { tenantId })
      .andWhere('content.deletedAt IS NULL');

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('content.status = :status', { status });
    }

    // 分类筛选
    if (categoryId) {
      queryBuilder.andWhere('content.categoryId = :categoryId', { categoryId });
    }

    // 关键词搜索
    if (keyword) {
      queryBuilder.andWhere(
        '(content.title LIKE :keyword OR content.content LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 语言筛选
    if (language) {
      queryBuilder.andWhere('content.language = :language', { language });
    }

    // 分页
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    // 排序
    queryBuilder.orderBy('content.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  /**
   * 获取内容详情
   */
  async findOne(id: number, tenantId: number): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id, tenantId },
    });

    if (!content) {
      throw new NotFoundException('内容不存在');
    }

    return content;
  }

  /**
   * 更新内容
   */
  async update(
    id: number,
    updateContentDto: UpdateContentDto,
    tenantId: number,
    userId: number,
  ): Promise<Content> {
    const content = await this.findOne(id, tenantId);

    // 检查slug是否已被其他内容使用
    if (updateContentDto.slug && updateContentDto.slug !== content.slug) {
      const existing = await this.contentRepository.findOne({
        where: { tenantId, slug: updateContentDto.slug },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('URL别名已存在');
      }
    }

    // 更新内容
    Object.assign(content, updateContentDto);
    content.version += 1;

    const updatedContent = await this.contentRepository.save(content);

    // 创建新版本
    await this.createVersion(updatedContent, userId, '内容更新');

    return updatedContent;
  }

  /**
   * 删除内容（软删除）
   */
  async remove(id: number, tenantId: number): Promise<void> {
    const content = await this.findOne(id, tenantId);
    await this.contentRepository.softRemove(content);
  }

  /**
   * 创建内容版本
   */
  private async createVersion(
    content: Content,
    userId: number,
    changeLog: string,
  ): Promise<ContentVersion> {
    const version = this.versionRepository.create({
      contentId: content.id,
      version: content.version,
      title: content.title,
      summary: content.summary,
      content: content.content,
      contentType: content.contentType,
      createdBy: userId,
      changeLog,
    });

    return this.versionRepository.save(version);
  }

  /**
   * 获取内容版本历史
   */
  async getVersions(
    contentId: number,
    tenantId: number,
  ): Promise<ContentVersion[]> {
    // 验证内容是否属于该租户
    await this.findOne(contentId, tenantId);

    return this.versionRepository.find({
      where: { contentId },
      order: { version: 'DESC' },
    });
  }

  /**
   * 回滚到指定版本
   */
  async rollbackToVersion(
    contentId: number,
    versionNumber: number,
    tenantId: number,
    userId: number,
  ): Promise<Content> {
    const content = await this.findOne(contentId, tenantId);

    // 获取目标版本
    const targetVersion = await this.versionRepository.findOne({
      where: { contentId, version: versionNumber },
    });

    if (!targetVersion) {
      throw new NotFoundException('版本不存在');
    }

    // 回滚内容
    content.title = targetVersion.title;
    content.summary = targetVersion.summary;
    content.content = targetVersion.content;
    content.contentType = targetVersion.contentType;
    content.version += 1;

    const rolledBackContent = await this.contentRepository.save(content);

    // 创建回滚版本记录
    await this.createVersion(
      rolledBackContent,
      userId,
      `回滚到版本 ${versionNumber}`,
    );

    return rolledBackContent;
  }

  /**
   * 提交审核
   */
  async submitForReview(
    contentId: number,
    tenantId: number,
  ): Promise<Content> {
    const content = await this.findOne(contentId, tenantId);

    if (content.status !== ContentStatus.DRAFT) {
      throw new BadRequestException('只能提交草稿内容进行审核');
    }

    content.status = ContentStatus.PENDING;
    return this.contentRepository.save(content);
  }

  /**
   * 审核内容
   */
  async auditContent(
    contentId: number,
    auditorId: number,
    approved: boolean,
    comment?: string,
  ): Promise<ContentAudit> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('内容不存在');
    }

    if (content.status !== ContentStatus.PENDING) {
      throw new BadRequestException('内容不在待审核状态');
    }

    // 创建审核记录
    const audit = this.auditRepository.create({
      contentId,
      auditorId,
      status: approved ? AuditStatus.APPROVED : AuditStatus.REJECTED,
      comment,
      auditedAt: new Date(),
    });

    const savedAudit = await this.auditRepository.save(audit);

    // 更新内容状态
    content.status = approved ? ContentStatus.PUBLISHED : ContentStatus.DRAFT;
    if (approved && !content.publishAt) {
      content.publishAt = new Date();
    }
    await this.contentRepository.save(content);

    return savedAudit;
  }

  /**
   * 发布内容
   */
  async publish(contentId: number, tenantId: number): Promise<Content> {
    const content = await this.findOne(contentId, tenantId);

    content.status = ContentStatus.PUBLISHED;
    if (!content.publishAt) {
      content.publishAt = new Date();
    }

    return this.contentRepository.save(content);
  }

  /**
   * 下线内容
   */
  async offline(contentId: number, tenantId: number): Promise<Content> {
    const content = await this.findOne(contentId, tenantId);

    content.status = ContentStatus.OFFLINE;
    content.offlineAt = new Date();

    return this.contentRepository.save(content);
  }

  /**
   * 增加浏览次数
   */
  async incrementViewCount(id: number): Promise<void> {
    await this.contentRepository.increment({ id }, 'viewCount', 1);
  }

  /**
   * 点赞
   */
  async like(id: number): Promise<void> {
    await this.contentRepository.increment({ id }, 'likeCount', 1);
  }
}
