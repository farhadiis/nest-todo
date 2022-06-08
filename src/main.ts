import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventStoreDbService } from './services/event-store-db.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService = app.get(ConfigService);
  const eventStoreDbService: EventStoreDbService = app.get(EventStoreDbService);

  await eventStoreDbService.connect();
  await app.listen(configService.get('PORT'));
}
bootstrap();
