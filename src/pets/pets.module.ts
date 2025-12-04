import { Module } from '@nestjs/common';
import { PetsService } from './service/pets.service';
import { PetsController } from './controller/pets.controller';
import { PetsRepository } from './repository/pets.repository';
import { PrismaModule } from '../prisma.module';
import { UsersModule } from '../users/users.module';
import { DailyModule } from '../daily/daily.module';

@Module({
  imports: [PrismaModule, UsersModule, DailyModule],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
  exports: [PetsRepository],
})
export class PetsModule {}