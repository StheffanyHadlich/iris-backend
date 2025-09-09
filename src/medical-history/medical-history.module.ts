import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';

@Module({
  providers: [MedicalHistoryService],
  controllers: [MedicalHistoryController]
})
export class MedicalHistoryModule {}
