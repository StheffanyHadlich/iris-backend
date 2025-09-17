import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './service/medical-history.service';
import { MedicalHistoryController } from './controller/medical-history.controller';

@Module({
  providers: [MedicalHistoryService],
  controllers: [MedicalHistoryController]
})
export class MedicalHistoryModule {}
