import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { Tenant } from './entities/tenant.entity';
import { TenantQuota } from './entities/tenant-quota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, TenantQuota])],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
