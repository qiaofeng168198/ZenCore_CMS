import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ContentType, ContentStatus } from '../entities/content.entity';

export class CreateContentDto {
  @ApiProperty({ description: '标题', example: '示例文章标题' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'URL别名', example: 'sample-article' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({ description: '分类ID', required: false })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ description: '摘要', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '内容类型', enum: ContentType })
  @IsEnum(ContentType)
  contentType: ContentType;

  @ApiProperty({ description: '封面图', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: '状态', enum: ContentStatus, required: false })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({ description: '发布时间', required: false })
  @IsOptional()
  @IsDateString()
  publishAt?: Date;

  @ApiProperty({ description: '下线时间', required: false })
  @IsOptional()
  @IsDateString()
  offlineAt?: Date;

  @ApiProperty({ description: '是否置顶', required: false })
  @IsOptional()
  @IsBoolean()
  isTop?: boolean;

  @ApiProperty({ description: '是否推荐', required: false })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  @ApiProperty({ description: 'SEO标题', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @ApiProperty({ description: 'SEO关键词', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoKeywords?: string;

  @ApiProperty({ description: 'SEO描述', required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ description: '语言', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: '标签ID列表', required: false })
  @IsOptional()
  tags?: number[];
}
