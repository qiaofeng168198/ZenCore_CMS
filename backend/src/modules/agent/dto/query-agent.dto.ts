import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AgentLevel } from './create-agent.dto';

export class QueryAgentDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 10;

  @ApiPropertyOptional({ description: '代理商级别', enum: AgentLevel })
  @IsOptional()
  @IsEnum(AgentLevel)
  level?: AgentLevel;

  @ApiPropertyOptional({ description: '上级代理商ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentId?: number;

  @ApiPropertyOptional({ description: '搜索关键词（名称、编号）' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '省份' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  @IsString()
  city?: string;
}
