import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включите CORS с настройками
  app.enableCors({
    origin: 'http://localhost:5173', // или true для разрешения всех доменов
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(3000);
}
bootstrap();
