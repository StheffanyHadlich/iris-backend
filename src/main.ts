import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const WEBSITE_URL = 'http://localhost:3001';

  app.enableCors({
    origin: WEBSITE_URL, // frontend URL
    credentials: true, // allow cookies
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Pet Management API')
    .setDescription(
      'API for managing users and their pets. Includes authentication and authorization with JWT.',
    )
    .setVersion('1.0')
    .addBearerAuth() // JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keep auth info on page reload
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
