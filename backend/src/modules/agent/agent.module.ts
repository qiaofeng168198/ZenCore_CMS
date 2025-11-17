import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { AgentCommission } from './entities/agent-commission.entity';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, AgentCommission])],
  providers: [AgentService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule {}
