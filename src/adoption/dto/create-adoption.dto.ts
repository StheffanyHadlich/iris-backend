import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAdoptionDto {
  @IsInt()
  @IsNotEmpty()
  adopterId: number;

  @IsInt()
  @IsNotEmpty()
  petId: number;

  @IsDateString()
  @IsNotEmpty()
  adoptionDate: string;
}
