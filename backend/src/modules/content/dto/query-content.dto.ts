import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '../entities/content.entity';

export class QueryContentDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({ description: '状态', enum: ContentStatus, required: false })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({ description: '分类ID', required: false })
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: '语言', required: false })
  @IsOptional()
  @IsString()
  language?: string;
}
