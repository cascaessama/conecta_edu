import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(process.env.PORT) || 3010);
}
bootstrap();
