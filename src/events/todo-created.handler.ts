import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { TodoCreatedEvent } from './todo-created.event';
import { EventStoreDbService } from '../services/event-store-db.service';
import { TodoService } from '../services/todo.service';

@EventsHandler(TodoCreatedEvent)
export class TodoCreatedHandler implements IEventHandler<TodoCreatedEvent> {
  constructor(
    private readonly eventStoreDbService: EventStoreDbService,
    private readonly todoService: TodoService,
  ) {}
  async handle(event: TodoCreatedEvent) {
    console.log('TodoCreatedEvent...');
    const lastEvent = await this.eventStoreDbService.getLastEvent(); // or find by event
    await this.todoService.store(lastEvent);
  }
}
