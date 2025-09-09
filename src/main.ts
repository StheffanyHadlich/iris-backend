import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const WEBSITE_URL = 'http://localhost:3001';

  app.enableCors({
    origin: WEBSITE_URL, // URL do frontend
    credentials: true, // se precisar enviar cookies ou autenticação
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
