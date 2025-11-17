import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment-record.entity';

export class PayOrderDto {
  @ApiProperty({ description: '支付方式', enum: PaymentMethod })
  @IsNotEmpty({ message: '支付方式不能为空' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
