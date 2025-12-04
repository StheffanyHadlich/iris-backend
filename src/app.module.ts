import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { AdopterModule } from './adopter/adopter.module';
import { DailyModule } from './daily/daily.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { AdoptionModule } from './adoption/adoption.module';

@Module({
  imports: [
    PrismaModule,
    PetsModule,
    AdopterModule,
    DailyModule,
    MedicalHistoryModule,
    AdoptionModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
