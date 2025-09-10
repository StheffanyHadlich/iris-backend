import { PartialType } from '@nestjs/mapped-types';
import { CreateAdopterDto } from './create-adopter.dto';

export class UpdateAdopterDto extends PartialType(CreateAdopterDto) {}
