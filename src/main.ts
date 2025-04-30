import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Ajoutez cette importation

async function bootstrap() {
  // Utilisez NestExpressApplication comme type explicite ici
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // VALIDATION PIPE
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Configuration du dossier de téléchargement
  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('Uploads directory path:', uploadsPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads'
  });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Watch api')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();