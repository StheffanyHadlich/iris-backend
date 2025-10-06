import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';

let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const WEBSITE_URL = process.env.WEBSITE_URL ?? 'http://localhost:3001';

  app.enableCors({
    origin: WEBSITE_URL,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  setupSwagger(app);

  await app.init(); 
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req,res){
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
}