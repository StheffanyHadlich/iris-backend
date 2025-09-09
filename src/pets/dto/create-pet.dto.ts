import { IsString, IsInt, IsOptional, IsEnum, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PetStatus } from '@prisma/client';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsInt()
  @Type(() => Number)
  age: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  race?: string;

  @IsOptional()
  @Transform(({ value }) => value !== undefined ? String(value) : undefined)
  currentWeight?: string;

  @IsOptional()
  @IsString()
  urlPhoto?: string;

  @IsEnum(PetStatus)
  @IsOptional()
  status?: PetStatus;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'registrationDate deve ser em formato YYYY-MM-DD',
  })
  registrationDate: string;
}
