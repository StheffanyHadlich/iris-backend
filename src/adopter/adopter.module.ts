import { Module } from '@nestjs/common';
import { AdopterService } from './service/adopter.service';
import { AdopterController } from './controller/adopter.controller';

@Module({
  providers: [AdopterService],
  controllers: [AdopterController],
})
export class AdopterModule {}
