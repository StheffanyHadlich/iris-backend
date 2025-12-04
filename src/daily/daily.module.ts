import { Module } from '@nestjs/common';
import { DiaryService } from './service/daily.service';
import { DiaryController } from './controller/daily.controller';

@Module({
  providers: [DiaryService],
  controllers: [DiaryController],
})
export class DailyModule {}
