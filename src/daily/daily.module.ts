import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';

@Module({
  providers: [DailyService],
  controllers: [DailyController]
})
export class DailyModule {}
