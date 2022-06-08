import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { ConfigModule } from '@nestjs/config';
import { EventStoreDbService } from './services/event-store-db.service';
import configuration from './configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
    }),
  ],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService, EventStoreDbService],
})
export class AppModule {}
