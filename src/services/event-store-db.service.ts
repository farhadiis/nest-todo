import { Injectable } from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
} from '@eventstore/db-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventStoreDbService {
  client;

  constructor(private configService: ConfigService) {}

  async connect() {
    this.client = EventStoreDBClient.connectionString(
      this.configService.get('ES_DB_URI'),
    );
  }

  async checkConnection() {
    if (!this.client) {
      throw Error('Event store db not connected.');
    }
  }

  async push(todoText: string, streamName = 'todo-stream') {
    await this.checkConnection();
    type TodoEvent = JSONEventType<
      'TodoEvent',
      {
        entityId: string;
        todoText: string;
      }
    >;

    const event = jsonEvent<TodoEvent>({
      type: 'TodoEvent',
      data: {
        entityId: uuid(),
        todoText: todoText,
      },
    });

    await this.client.appendToStream(streamName, event);
  }
}
