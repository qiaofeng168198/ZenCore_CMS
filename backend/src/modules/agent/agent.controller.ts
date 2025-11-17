import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { QueryAgentDto } from './dto/query-agent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentStatus } from './entities/agent.entity';

@ApiTags('代理商管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @ApiOperation({ summary: '创建代理商' })
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentService.create(createAgentDto);
  }

  @Get()
  @ApiOperation({ summary: '获取代理商列表' })
  findAll(@Query() queryDto: QueryAgentDto) {
    return this.agentService.findAll(queryDto);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取代理商层级树' })
  @ApiQuery({ name: 'parentId', required: false, description: '父级ID，不传则获取顶级' })
  getTree(@Query('parentId') parentId?: number) {
    return this.agentService.getTree(parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取代理商详情' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新代理商' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除代理商' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agentService.remove(id);
  }

  @Post(':id/status')
  @ApiOperation({ summary: '更新代理商状态' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: AgentStatus,
  ) {
    return this.agentService.updateStatus(id, status);
  }

  @Get(':id/customers')
  @ApiOperation({ summary: '获取代理商客户列表' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  getCustomers(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.agentService.getCustomers(id, page, pageSize);
  }

  @Get(':id/commissions')
  @ApiOperation({ summary: '获取代理商佣金记录' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  getCommissions(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.agentService.getCommissions(id, page, pageSize);
  }

  @Post(':id/commissions')
  @ApiOperation({ summary: '创建佣金记录' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  createCommission(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { orderId?: number; tenantId: number; amount: number },
  ) {
    return this.agentService.createCommission({
      agentId: id,
      ...data,
    });
  }

  @Post('commissions/:commissionId/settle')
  @ApiOperation({ summary: '结算佣金' })
  @ApiParam({ name: 'commissionId', description: '佣金记录ID' })
  settleCommission(@Param('commissionId', ParseIntPipe) commissionId: number) {
    return this.agentService.settleCommission(commissionId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: '获取代理商统计数据' })
  @ApiParam({ name: 'id', description: '代理商ID' })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.agentService.getStats(id);
  }
}
