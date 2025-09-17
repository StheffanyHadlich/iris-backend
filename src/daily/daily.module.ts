import { Module } from '@nestjs/common';
import { DailyService } from './service/daily.service';
import { DailyController } from './controller/daily.controller';

@Module({
  providers: [DailyService],
  controllers: [DailyController]
})
export class DailyModule {}
