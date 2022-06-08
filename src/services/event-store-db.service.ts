import { Injectable } from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
  END,
} from '@eventstore/db-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

type TodoEvent = JSONEventType<
  'TodoEvent',
  {
    entityId: string;
    todoText: string;
  }
>;

@Injectable()
export class EventStoreDbService {
  private readonly streamName = 'todo-stream';
  private client: EventStoreDBClient;

  constructor(private configService: ConfigService) {}

  async connect() {
    this.client = EventStoreDBClient.connectionString(
      this.configService.get('EVENT_STORE_URI'),
    );
    await this.subscribe();
  }

  private async checkConnection() {
    if (!this.client) {
      throw Error('Event store db not connected.');
    }
  }

  async push(text: string) {
    await this.checkConnection();
    const event = jsonEvent<TodoEvent>({
      type: 'TodoEvent',
      data: {
        entityId: uuid(),
        todoText: text,
      },
    });
    await this.client.appendToStream(this.streamName, event);
  }

  private async subscribe() {
    this.client
      .subscribeToStream<TodoEvent>(this.streamName, {
        fromRevision: END,
      })
      .on('data', (resolvedEvent) => {
        console.log(resolvedEvent.event?.data);
      });
  }
}
