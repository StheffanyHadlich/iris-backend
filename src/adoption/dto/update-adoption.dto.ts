import { PartialType } from '@nestjs/mapped-types';
import { CreateAdoptionDto } from './create-adoption.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { AdoptionStatus } from '@prisma/client';

export class UpdateAdoptionDto extends PartialType(CreateAdoptionDto) {
  @IsEnum(AdoptionStatus)
  @IsOptional()
  status?: AdoptionStatus;
}
