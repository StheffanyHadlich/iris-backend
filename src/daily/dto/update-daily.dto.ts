import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyDto } from './create-daily.dto';

export class UpdateDailyDto extends PartialType(CreateDailyDto) {}
