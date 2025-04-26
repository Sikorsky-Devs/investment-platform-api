import { PrismaService } from '../../database/prisma.service';
import { CreateInvestmentDto } from '../project/dto/create-investment.dto';
import { InvestmentEntity } from '../project/entity/investment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvestmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentEntity> {
    return this.prismaService.investment.create({
      data: createInvestmentDto,
    });
  }
}
