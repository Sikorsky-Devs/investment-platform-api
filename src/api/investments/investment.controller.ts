import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from '../project/dto/create-investment.dto';
import { InvestmentEntity } from '../project/entity/investment.entity';
import { Response } from 'express';

@Controller('investments')
@ApiTags('Investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @ApiOkResponse({ type: InvestmentEntity })
  @Post()
  async create(
    @Body() createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentEntity> {
    return this.investmentService.create(createInvestmentDto);
  }

  @Get('/:id/certificates')
  async getCertificate(@Param('id') id: string, @Res() res: Response) {
    const cert = await this.investmentService.getCertificate(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=certificate.pdf',
    );
    res.send(cert);
  }
}
