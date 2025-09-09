import { Module } from '@nestjs/common';
import { AdopterService } from './adopter.service';
import { AdopterController } from './adopter.controller';

@Module({
  providers: [AdopterService],
  controllers: [AdopterController]
})
export class AdopterModule {}
