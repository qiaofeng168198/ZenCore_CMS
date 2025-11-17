import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { QueryContentDto } from './dto/query-content.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/tenant.decorator';

@ApiTags('contents')
@Controller('contents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: '创建内容' })
  async create(
    @Body() createContentDto: CreateContentDto,
    @CurrentTenant() tenantId: number,
    @CurrentUser() user: any,
  ) {
    return this.contentService.create(createContentDto, tenantId, user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取内容列表' })
  async findAll(
    @CurrentTenant() tenantId: number,
    @Query() query: QueryContentDto,
  ) {
    return this.contentService.findAll(tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取内容详情' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenant() tenantId: number,
  ) {
    return this.contentService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新内容' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto,
    @CurrentTenant() tenantId: number,
    @CurrentUser() user: any,
  ) {
    return this.contentService.update(id, updateContentDto, tenantId, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除内容' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenant() tenantId: number,
  ) {
    await this.contentService.remove(id, tenantId);
    return { message: '删除成功' };
  }

  @Get(':id/versions')
  @ApiOperation({ summary: '获取内容版本历史' })
  async getVersions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenant() tenantId: number,
  ) {
    return this.contentService.getVersions(id, tenantId);
  }

  @Post(':id/rollback/:version')
  @ApiOperation({ summary: '回滚到指定版本' })
  async rollback(
    @Param('id', ParseIntPipe) id: number,
    @Param('version', ParseIntPipe) version: number,
    @CurrentTenant() tenantId: number,
    @CurrentUser() user: any,
  ) {
    return this.contentService.rollbackToVersion(id, version, tenantId, user.id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: '提交审核' })
  async submitForReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenant() tenantId: number,
  ) {
    return this.contentService.submitForReview(id, tenantId);
  }

  @Post(':id/audit')
  @ApiOperation({ summary: '审核内容' })
  async audit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { approved: boolean; comment?: string },
    @CurrentUser() user: any,
  ) {
    return this.contentService.auditContent(
      id,
      user.id,
      body.approved,
      body.comment,
    );
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布内容' })
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenant() tenantId: number,
  ) {
    return this.contentService.publish(id, tenantId);
  }

  @Post(':id/offline')
  @ApiOperation({ summary: '下线内容' })
  async offline(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenant() tenantId: number,
  ) {
    return this.contentService.offline(id, tenantId);
  }

  @Post(':id/view')
  @ApiOperation({ summary: '增加浏览次数' })
  async view(@Param('id', ParseIntPipe) id: number) {
    await this.contentService.incrementViewCount(id);
    return { message: '成功' };
  }

  @Post(':id/like')
  @ApiOperation({ summary: '点赞' })
  async like(@Param('id', ParseIntPipe) id: number) {
    await this.contentService.like(id);
    return { message: '成功' };
  }
}
