import { IsNotEmpty, IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderType } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty({ description: '订单类型', enum: OrderType })
  @IsNotEmpty({ message: '订单类型不能为空' })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({ description: '商品ID（套餐ID、模板ID等）' })
  @IsNotEmpty({ message: '商品ID不能为空' })
  @IsNumber()
  itemId: number;

  @ApiProperty({ description: '商品名称' })
  @IsNotEmpty({ message: '商品名称不能为空' })
  @IsString()
  itemName: string;

  @ApiProperty({ description: '金额' })
  @IsNotEmpty({ message: '金额不能为空' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ description: '优惠金额', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}
