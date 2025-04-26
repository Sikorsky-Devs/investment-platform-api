import { $Enums, Project } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoEntity } from './photo.entity';
import { ProductEntity } from './product.entity';

export class ProjectWithProductEntity implements Project {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  estimatedCost: number;

  @ApiProperty({ enum: $Enums.CurrencyType })
  currencyType: $Enums.CurrencyType;

  @ApiProperty({ enum: $Enums.ProjectType })
  projectType: $Enums.ProjectType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: () => PhotoEntity })
  photos: PhotoEntity[];

  @ApiProperty({ type: () => ProductEntity })
  products: ProductEntity[];

  @ApiProperty()
  createdAt: Date;
}
