import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalHistoryDto } from './create-medical-history.dto';

export class UpdateMedicalHistoryDto extends PartialType(CreateMedicalHistoryDto) {}