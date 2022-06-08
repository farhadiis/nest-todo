import { Injectable } from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
  END,
} from '@eventstore/db-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventStoreDbService {
  streamName = 'todo-stream';
  client;

  constructor(private configService: ConfigService) {}

  async connect() {
    this.client = EventStoreDBClient.connectionString(
      this.configService.get('EVENT_STORE_URI'),
    );
    await this.subscribe();
  }

  async checkConnection() {
    if (!this.client) {
      throw Error('Event store db not connected.');
    }
  }

  async push(todoText: string, streamName = this.streamName) {
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

  private async subscribe() {
    const subscription = this.client.subscribeToStream(this.streamName, {
      fromRevision: END,
    });

    for await (const resolvedEvent of subscription) {
      console.log(resolvedEvent.event?.data);
    }
  }
}
