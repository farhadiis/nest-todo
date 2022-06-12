import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { TodoCreatedEvent } from './todo-created.event';
import { TodoService } from '../services/todo.service';

@EventsHandler(TodoCreatedEvent)
export class TodoCreatedHandler implements IEventHandler<TodoCreatedEvent> {
  constructor(private readonly todoService: TodoService) {}

  async handle(event: TodoCreatedEvent) {
    console.log('TodoCreatedEvent...');
    await this.todoService.store(event);
  }
}
