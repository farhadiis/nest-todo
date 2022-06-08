import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { ConfigModule } from '@nestjs/config';
import { EventStoreDbService } from './services/event-store-db.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService, EventStoreDbService],
})
export class AppModule {}
