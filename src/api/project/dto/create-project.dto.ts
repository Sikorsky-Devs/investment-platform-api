import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { $Enums } from '@prisma/client';
import { CreatePhotoDto } from './create-photo.dto';
import { Type } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  estimatedCost: number;

  @ApiProperty({ enum: $Enums.CurrencyType })
  @IsEnum($Enums.CurrencyType)
  currencyType: $Enums.CurrencyType;

  @ApiProperty({ enum: $Enums.ProjectType })
  @IsEnum($Enums.ProjectType)
  projectType: $Enums.ProjectType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({ type: () => [CreatePhotoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  photos: CreatePhotoDto[];

  @ApiProperty({ type: () => [CreateProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  product: CreateProductDto[];
}
