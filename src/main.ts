import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
    console.log(`app is listening on port ${configService.get('PORT')}`),
  );
})();

const graceful = async () => {
  const seconds = 2;
  console.log('verbose', `app will shut down after ${seconds} seconds.`);
  try {
  } catch (err) {
    console.log(
      'error',
      'app was not able to graceful stop due to the following error: ' +
        err.message,
    );
  }
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  process.exit(0);
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
process.on('SIGUSR1', graceful);
process.on('uncaughtException', function (err) {
  console.log('error', 'uncaught exception: ' + err.message);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
