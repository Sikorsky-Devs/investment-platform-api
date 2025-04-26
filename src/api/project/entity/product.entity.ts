import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { InvestmentEntity } from './investment.entity';

export class ProductEntity implements Product {
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  projectId: string;
  @ApiProperty()
  amount: number;

  @ApiProperty({ type: [InvestmentEntity] })
  investments: InvestmentEntity[];
}
