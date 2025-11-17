import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class SubscribeDto {
  @ApiProperty({ description: '套餐ID' })
  @IsNotEmpty({ message: '套餐ID不能为空' })
  @IsNumber()
  planId: number;

  @ApiProperty({ description: '计费周期', enum: BillingCycle })
  @IsNotEmpty({ message: '计费周期不能为空' })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
