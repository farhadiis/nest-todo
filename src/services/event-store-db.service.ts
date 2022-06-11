import { Injectable } from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
  END,
  BACKWARDS,
} from '@eventstore/db-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { Subject } from 'rxjs';

export type TodoEvent = JSONEventType<
  'TodoEvent',
  {
    entityId: string;
    text: string;
  }
>;

@Injectable()
export class EventStoreDbService {
  private readonly streamName = 'todo-stream';
  private client: EventStoreDBClient;
  events = new Subject<TodoEvent>();

  constructor(private readonly configService: ConfigService) {}

  async connect() {
    this.client = EventStoreDBClient.connectionString(
      this.configService.get('EVENT_STORE_URI'),
    );
    this.client
      .subscribeToStream<TodoEvent>(this.streamName, {
        fromRevision: END,
      })
      .on('data', (resolvedEvent) => this.events.next(resolvedEvent.event));
  }

  private async checkConnection() {
    if (!this.client) {
      throw Error('Event store db not connected.');
    }
  }

  async recordEvent(text: string) {
    await this.checkConnection();
    const event = jsonEvent<TodoEvent>({
      type: 'TodoEvent',
      data: {
        entityId: uuid(),
        text: text,
      },
    });
    await this.client.appendToStream<TodoEvent>(this.streamName, event);
  }

  async getLastEvent(): Promise<TodoEvent> {
    await this.checkConnection();
    const events = this.client.readStream<TodoEvent>(this.streamName, {
      fromRevision: END,
      direction: BACKWARDS,
      maxCount: 1,
    });
    let last;
    for await (const resolvedEvent of events) {
      last = resolvedEvent.event?.data;
      if (last) {
        break;
      }
    }
    return last;
  }
}
