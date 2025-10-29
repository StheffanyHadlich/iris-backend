import { Module } from '@nestjs/common';
import { AdoptionService } from './service/adoption.service';
import { AdoptionController } from './controller/adoption.controller';
import { AdoptionRepository } from './repository/adoption.repository';
import { PetsRepository } from '../pets/repository/pets.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AdoptionController],
  providers: [AdoptionService, AdoptionRepository, PetsRepository, PrismaService],
})
export class AdoptionModule {}
