import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './shared/middlewares/redoc.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe()); // Adicionando ValidationPipe global

  const config = new DocumentBuilder()
    .setTitle('Conecta-Edu')
    .setDescription('Descreve a API do Conecta-Eduk')
    .setVersion('1.0')
    .addTag('portal')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  setupRedoc(app);
  await app.listen(Number(process.env.PORT) || 3010);
}
bootstrap();
