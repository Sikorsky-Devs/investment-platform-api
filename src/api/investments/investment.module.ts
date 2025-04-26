import { Module } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { PrismaService } from '../../database/prisma.service';
import { FileModule } from '../../file/file.module';
import { InvestmentController } from './investment.controller';

@Module({
  providers: [InvestmentService, PrismaService],
  imports: [FileModule],
  controllers: [InvestmentController],
})
export class InvestmentModule {}
