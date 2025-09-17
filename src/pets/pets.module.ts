import { Module } from '@nestjs/common';
import { PetsService } from './service/pets.service';
import { PetsController } from './controller/pets.controller';
import { PetsRepository } from './repository/pets.repository';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
  exports: [PetsRepository],
})
export class PetsModule {}
