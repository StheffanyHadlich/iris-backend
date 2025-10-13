import { Module } from '@nestjs/common';
import { PetsService } from './service/pets.service';
import { PetsController } from './controller/pets.controller';
import { PetsRepository } from './repository/pets.repository';
import { PrismaModule } from '../prisma.module';
import { UsersModule } from '../users/users.module';
import { DiaryController } from 'src/daily/controller/daily.controller';
import { DiaryService } from 'src/daily/service/daily.service';
import { DiaryRepository } from 'src/daily/repository/diary.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [PetsController, DiaryController],
  providers: [PetsService, DiaryService, PetsRepository, DiaryRepository],
  exports: [PetsRepository],
})
export class PetsModule {}
