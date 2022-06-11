import { Injectable } from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
  END,
} from '@eventstore/db-client';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { TodoCreatedEvent } from '../events/todo-created.event';
import { EventBus } from '@nestjs/cqrs';

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

  constructor(
    private readonly eventBus: EventBus,
    private readonly configService: ConfigService,
  ) {}

  public async connect() {
    this.client = EventStoreDBClient.connectionString(
      this.configService.get('EVENT_STORE_URI'),
    );
  }

  public async subscribe() {
    this.client
      .subscribeToStream<TodoEvent>(this.streamName, {
        fromRevision: END,
      })
      .on('data', (resolvedEvent) =>
        this.eventBus.publish(
          new TodoCreatedEvent(resolvedEvent.event?.data.text),
        ),
      );
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
}
