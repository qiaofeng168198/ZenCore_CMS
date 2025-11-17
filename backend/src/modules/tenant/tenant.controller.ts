import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@ApiTags('tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: '创建租户' })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有租户' })
  async findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取租户详情' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tenant> {
    return this.tenantService.findOne(id);
  }
}
