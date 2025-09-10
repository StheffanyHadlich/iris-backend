import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateAdopterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
