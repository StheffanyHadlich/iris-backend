import { Module } from '@nestjs/common';
import { DiaryService } from './service/daily.service';
import { DiaryController } from './controller/daily.controller';
import { DiaryRepository } from './repository/diary.repository';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DiaryService, DiaryRepository],
  controllers: [DiaryController],
  exports: [DiaryService, DiaryRepository],
})
export class DailyModule {}