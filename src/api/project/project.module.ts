import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PrismaService } from '../../database/prisma.service';
import { ProjectController } from './project.controller';

@Module({
  providers: [ProjectService, PrismaService],
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [],
})
export class ProjectModule {}
