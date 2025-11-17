import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefundOrderDto {
  @ApiProperty({ description: '退款金额' })
  @IsNotEmpty({ message: '退款金额不能为空' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ description: '退款原因' })
  @IsOptional()
  @IsString()
  reason?: string;
}
