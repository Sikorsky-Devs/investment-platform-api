import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PrismaService } from '../../database/prisma.service';
import { ProjectController } from './project.controller';
import { FileModule } from '../../file/file.module';

@Module({
  providers: [ProjectService, PrismaService],
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [FileModule],
})
export class ProjectModule {}
