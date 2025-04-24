import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // VALIDATION PIPE
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Luxury API')
    .setDescription('The Luxury API description')
    .setVersion('1.0.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // CONNEXION SERVEUR
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
