import { Module } from '@nestjs/common';
import { AdoptionService } from './service/adoption.service';
import { AdoptionController } from './controller/adoption.controller';

@Module({
  providers: [AdoptionService],
  controllers: [AdoptionController],
})
export class AdoptionModule {}
