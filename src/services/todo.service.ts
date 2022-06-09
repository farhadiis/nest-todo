import { Injectable } from '@nestjs/common';
import { Todo } from '../controllers/interfaces/todo';
import { EventStoreDbService, TodoEvent } from './event-store-db.service';

@Injectable()
export class TodoService {
  constructor(private readonly eventStoreDbService: EventStoreDbService) {
    eventStoreDbService.events.subscribe(this.store);
  }
  async create(todo: Todo) {
    await this.eventStoreDbService.push(todo.text);
  }

  async store(event: TodoEvent) {
    console.log(event.data.text);
  }
}
