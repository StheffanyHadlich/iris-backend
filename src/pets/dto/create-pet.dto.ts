import { IsString, IsOptional, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PetStatus, PetSpecies, PetSex } from '@prisma/client';

export class CreatePetDto {
  @IsString()
  name: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(PetSpecies)
  species: PetSpecies;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @Transform(({ value }) => (value ? value.toUpperCase() : 'UNKNOWN'))
  @IsEnum(PetSex)
  @IsOptional()
  sex?: PetSex = PetSex.UNKNOWN;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  castrated?: boolean = false;

  @IsOptional()
  @IsString()
  urlPhoto?: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(PetStatus)
  @IsOptional()
  status?: PetStatus = PetStatus.AVAILABLE;

  @IsDate()
  @Type(() => Date)
  registrationDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;
}
