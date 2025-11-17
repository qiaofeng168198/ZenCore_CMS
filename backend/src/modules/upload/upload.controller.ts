import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/tenant.decorator';
import { UseType } from './entities/file.entity';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @CurrentTenant() tenantId: number,
    @Query('useType') useType?: UseType,
  ) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('只允许上传图片文件');
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小不能超过10MB');
    }

    return this.uploadService.saveFile(
      file,
      user.id,
      tenantId,
      useType || UseType.OTHER,
    );
  }

  @Post('file')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @CurrentTenant() tenantId: number,
    @Query('useType') useType?: UseType,
  ) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    // 验证文件大小 (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小不能超过100MB');
    }

    return this.uploadService.saveFile(
      file,
      user.id,
      tenantId,
      useType || UseType.OTHER,
    );
  }

  @Get()
  @ApiOperation({ summary: '获取文件列表' })
  async findAll(
    @CurrentTenant() tenantId: number,
    @Query('useType') useType?: UseType,
  ) {
    return this.uploadService.findAll(tenantId, useType);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    await this.uploadService.remove(id, user.id);
    return { message: '删除成功' };
  }
}
