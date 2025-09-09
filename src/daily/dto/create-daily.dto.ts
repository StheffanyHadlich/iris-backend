import { IsInt, IsOptional, IsDateString, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateDailyDto {
  @IsInt()
  @Type(() => Number)
  petId: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value))
  dailyDate: Date;

  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  weight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  prescriptionNotes?: string;
}
