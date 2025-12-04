import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaryDto } from './create-daily.dto';

export class UpdateDailyDto extends PartialType(CreateDiaryDto) {}
