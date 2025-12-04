// src/daily/daily.module.ts
import { Module } from '@nestjs/common';
import { DiaryService } from './service/daily.service';
import { DiaryController } from './controller/daily.controller';
import { DiaryRepository } from './repository/diary.repository';
import { PrismaModule } from '../prisma.module';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PrismaModule, PetsModule],
  providers: [DiaryService, DiaryRepository],
  controllers: [DiaryController],
  exports: [DiaryService, DiaryRepository],
})
export class DailyModule {}