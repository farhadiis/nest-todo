import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventStoreDbService } from './services/event-store-db.service';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService = app.get(ConfigService);
  const eventStoreDbService: EventStoreDbService = app.get(EventStoreDbService);

  await eventStoreDbService.connect();
  await eventStoreDbService.subscribe();
  await app.listen(configService.get('PORT'), () =>
    Logger.log(
      `app is listening on port ${configService.get('PORT')}`,
      'FarhadApplication',
    ),
  );
})();

const graceful = async () => {
  const seconds = 2;
  Logger.log(
    `app will shut down after ${seconds} seconds.`,
    'FarhadApplication',
  );
  try {
  } catch (err) {
    Logger.error(
      'app was not able to graceful stop due to the following error: ' +
        err.message,
      'FarhadApplication',
    );
  }
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  process.exit(0);
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
process.on('SIGUSR1', graceful);
process.on('uncaughtException', function (err) {
  Logger.log('uncaught exception: ' + err.message, 'FarhadApplication');
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
