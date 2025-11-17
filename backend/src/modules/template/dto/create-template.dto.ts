import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ description: '模板名称', example: '商务模板' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '模板代码', example: 'business-template' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: '模板描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '版本号', example: '1.0.0' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  version: string;

  @ApiProperty({ description: '封面图', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: '预览URL', required: false })
  @IsOptional()
  @IsString()
  previewUrl?: string;

  @ApiProperty({ description: '价格', default: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: '是否免费', default: false })
  @IsBoolean()
  isFree: boolean;

  @ApiProperty({ description: '分类', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ description: '是否响应式', default: true })
  @IsBoolean()
  isResponsive: boolean;

  @ApiProperty({ description: '是否支持移动端', default: true })
  @IsBoolean()
  supportMobile: boolean;

  @ApiProperty({ description: '是否支持小程序', default: false })
  @IsBoolean()
  supportMiniprogram: boolean;

  @ApiProperty({ description: '佣金比例', default: 30, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate: number;
}
