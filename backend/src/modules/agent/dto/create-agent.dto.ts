import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AgentLevel {
  PROVINCE = 'province',
  CITY = 'city',
  DISTRICT = 'district',
  PARTNER = 'partner',
}

export class CreateAgentDto {
  @ApiProperty({ description: '代理商名称' })
  @IsNotEmpty({ message: '代理商名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '代理商编号' })
  @IsNotEmpty({ message: '代理商编号不能为空' })
  @IsString()
  code: string;

  @ApiProperty({ description: '代理商级别', enum: AgentLevel })
  @IsNotEmpty({ message: '代理商级别不能为空' })
  @IsEnum(AgentLevel)
  level: AgentLevel;

  @ApiPropertyOptional({ description: '上级代理商ID' })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ description: '负责人姓名' })
  @IsNotEmpty({ message: '负责人姓名不能为空' })
  @IsString()
  contactName: string;

  @ApiProperty({ description: '联系电话' })
  @IsNotEmpty({ message: '联系电话不能为空' })
  @IsString()
  contactPhone: string;

  @ApiPropertyOptional({ description: '联系邮箱' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: '代理区域（省）' })
  @IsOptional()
  @IsString()
  regionProvince?: string;

  @ApiPropertyOptional({ description: '代理区域（市）' })
  @IsOptional()
  @IsString()
  regionCity?: string;

  @ApiPropertyOptional({ description: '代理区域（区）' })
  @IsOptional()
  @IsString()
  regionDistrict?: string;

  @ApiProperty({ description: '佣金比例（0-100）' })
  @IsNotEmpty({ message: '佣金比例不能为空' })
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}
