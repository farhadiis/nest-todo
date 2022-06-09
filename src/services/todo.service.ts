import { Injectable } from '@nestjs/common';
import { Todo } from '../controllers/interfaces/todo';
import { EventStoreDbService } from './event-store-db.service';

@Injectable()
export class TodoService {
  constructor(private readonly eventStoreDbService: EventStoreDbService) {
    eventStoreDbService.events.subscribe((value) => {
      console.log(value);
    });
  }
  async create(todo: Todo) {
    await this.eventStoreDbService.push(todo.text);
  }
}
