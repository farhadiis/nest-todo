import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { ConfigModule } from '@nestjs/config';
import { EventStoreDbService } from './services/event-store-db.service';
import configuration from './configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Todo, TodoSchema } from './models/todo';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CqrsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [AppController, TodoController],
  providers: [
    AppService,
    TodoService,
    EventStoreDbService,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class AppModule {}
