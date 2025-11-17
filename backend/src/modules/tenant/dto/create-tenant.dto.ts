import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: '租户名称', example: '示例企业' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: '租户代码(唯一标识)',
    example: 'demo-company',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: '租户代码只能包含小写字母、数字和连字符',
  })
  code: string;

  @ApiProperty({ description: '联系人姓名', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactName?: string;

  @ApiProperty({ description: '联系人邮箱', required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  contactEmail?: string;

  @ApiProperty({ description: '联系人电话', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiProperty({ description: '代理商ID', required: false })
  @IsOptional()
  agentId?: number;
}
