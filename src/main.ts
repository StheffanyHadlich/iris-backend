import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const WEBSITE_URL = 'http://localhost:3001';

  app.enableCors({
    origin: WEBSITE_URL,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
