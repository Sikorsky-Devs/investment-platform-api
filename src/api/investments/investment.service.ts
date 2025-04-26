import { PrismaService } from '../../database/prisma.service';
import { CreateInvestmentDto } from '../project/dto/create-investment.dto';
import { InvestmentEntity } from '../project/entity/investment.entity';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '../../utils/exception/entity-not-found.exception';
import { FileService } from '../../file/file.service';

@Injectable()
export class InvestmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async create(
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentEntity> {
    return this.prismaService.investment.create({
      data: createInvestmentDto,
    });
  }

  async getCertificate(id: string) {
    const investment = await this.prismaService.investment.findFirst({
      where: { id },
      include: {
        product: {
          include: {
            project: {
              include: {
                user: true,
              },
            },
          },
        },
        user: true,
      },
    });
    if (!investment) {
      throw new EntityNotFoundException('Investment', 'id');
    }
    const certificate = this.fileService.fillTemplate('certificate.docx', {
      investorName:
        investment.user.name ||
        `${investment.user.firstName} ${investment.user.lastName}`,
      projName: investment.product.project.name,
      productName: investment.product.name,
      projOwnerName:
        investment.product.project.user.name ||
        `${investment.product.project.user.firstName} ${investment.product.project.user.lastName}`,
      amount: investment.amount,
      date: new Date(investment.createdAt).toLocaleDateString(),
    });
    return this.fileService.convertDocxBufferToPdfBuffer(certificate);
  }
}
