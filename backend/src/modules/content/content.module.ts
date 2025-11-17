import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [],
  controllers: [],
  exports: [],
})
export class ContentModule {}
