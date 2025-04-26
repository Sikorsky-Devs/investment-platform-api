import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from '../project/dto/create-investment.dto';
import { InvestmentEntity } from '../project/entity/investment.entity';

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
}
