import { Investment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class InvestmentEntity implements Investment {
  @ApiProperty()
  id: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  createdAt: Date;
}
