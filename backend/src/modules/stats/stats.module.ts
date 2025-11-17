import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';
import { User } from '../user/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { Template } from '../template/entities/template.entity';
import { Agent } from '../agent/entities/agent.entity';
import { Order } from '../payment/entities/order.entity';
import { TenantSubscription } from '../subscription/entities/tenant-subscription.entity';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      User,
      Content,
      Template,
      Agent,
      Order,
      TenantSubscription,
    ]),
  ],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
