import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrencyType, ProjectType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindProjectsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(CurrencyType)
  currencyType?: CurrencyType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProjectType)
  projectType?: ProjectType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;
}
