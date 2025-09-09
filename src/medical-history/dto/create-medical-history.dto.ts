import { IsInt, IsOptional, IsDateString, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMedicalHistoryDto {
  @IsInt()
  @Type(() => Number) 
  petId: number;

  @IsDateString()
  @Transform(({ value }) => value ? new Date(value) : undefined) 
  medicalDate: Date;

  @IsOptional()
  @IsString()
  veterinarian?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  prescription?: string;
}
