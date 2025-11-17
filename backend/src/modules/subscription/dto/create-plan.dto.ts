import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ description: '套餐名称' })
  @IsNotEmpty({ message: '套餐名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '套餐编码' })
  @IsNotEmpty({ message: '套餐编码不能为空' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: '套餐描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '月付价格' })
  @IsNotEmpty({ message: '月付价格不能为空' })
  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @ApiProperty({ description: '年付价格' })
  @IsNotEmpty({ message: '年付价格不能为空' })
  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @ApiProperty({ description: '最大用户数，-1为不限制' })
  @IsNotEmpty({ message: '最大用户数不能为空' })
  @IsNumber()
  maxUsers: number;

  @ApiProperty({ description: '最大存储空间(MB)，-1为不限制' })
  @IsNotEmpty({ message: '最大存储空间不能为空' })
  @IsNumber()
  maxStorage: number;

  @ApiProperty({ description: '最大带宽(GB/月)，-1为不限制' })
  @IsNotEmpty({ message: '最大带宽不能为空' })
  @IsNumber()
  maxBandwidth: number;

  @ApiProperty({ description: '最大内容数，-1为不限制' })
  @IsNotEmpty({ message: '最大内容数不能为空' })
  @IsNumber()
  maxContents: number;

  @ApiPropertyOptional({ description: '是否支持自定义域名', default: false })
  @IsOptional()
  @IsBoolean()
  customDomain?: boolean;

  @ApiPropertyOptional({ description: '是否支持API访问', default: false })
  @IsOptional()
  @IsBoolean()
  apiAccess?: boolean;

  @ApiPropertyOptional({ description: '是否支持CDN加速', default: false })
  @IsOptional()
  @IsBoolean()
  cdnSupport?: boolean;

  @ApiPropertyOptional({ description: '是否支持多语言', default: false })
  @IsOptional()
  @IsBoolean()
  multiLanguage?: boolean;

  @ApiPropertyOptional({ description: '优先级（数字越大越靠前）', default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ description: '是否推荐', default: false })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}
