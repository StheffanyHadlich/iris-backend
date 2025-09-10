import { IsInt, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AdoptionStatus } from '@prisma/client';

export class CreateAdoptionDto {
  @IsInt()
  @Type(() => Number)
  petId: number;

  @IsInt()
  @Type(() => Number)
  adopterId: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value))
  startDate: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  endDate?: string;

  @IsEnum(AdoptionStatus)
  @IsOptional()
  status?: AdoptionStatus;
}