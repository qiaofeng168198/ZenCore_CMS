import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { TemplateStatus } from './entities/template.entity';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建模板' })
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentUser() user: any,
  ) {
    return this.templateService.create(createTemplateDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取模板列表' })
  async findAll(@Query('status') status?: TemplateStatus) {
    return this.templateService.findAll(status);
  }

  @Get('market')
  @ApiOperation({ summary: '获取模板市场列表' })
  async findMarket() {
    return this.templateService.findMarket();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取模板详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新模板' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @CurrentUser() user: any,
  ) {
    return this.templateService.update(id, updateTemplateDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除模板' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    await this.templateService.remove(id, user.id);
    return { message: '删除成功' };
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '提交审核' })
  async submitForReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.templateService.submitForReview(id, user.id);
  }

  @Post(':id/audit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '审核模板' })
  async audit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { approved: boolean; comment?: string },
  ) {
    return this.templateService.audit(id, body.approved, body.comment);
  }

  @Post(':id/offline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '下架模板' })
  async offline(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.offline(id);
  }

  @Post(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '下载模板' })
  async download(@Param('id', ParseIntPipe) id: number) {
    await this.templateService.incrementDownload(id);
    return { message: '下载成功' };
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '评分' })
  async rate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { score: number },
  ) {
    await this.templateService.rate(id, body.score);
    return { message: '评分成功' };
  }
}
