import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from './entities/content.entity';
import { ContentVersion } from './entities/content-version.entity';
import { ContentAudit } from './entities/content-audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, ContentVersion, ContentAudit])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
