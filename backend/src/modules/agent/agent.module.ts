import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AgentModule {}
