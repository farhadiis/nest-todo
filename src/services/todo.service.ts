import { Injectable } from '@nestjs/common';
import { Todo, TodoDocument } from '../models/todo';
import { EventStoreDbService, TodoEvent } from './event-store-db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
  constructor(
    private readonly eventStoreDbService: EventStoreDbService,
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  ) {
    eventStoreDbService.events.subscribe(
      async (event) => await this.store(event),
    );
  }
  async create(todo: Todo) {
    await this.eventStoreDbService.push(todo.text);
  }

  async store(event: TodoEvent) {
    const todo = new Todo();
    todo.text = event.data.text;
    const createdTodo = new this.todoModel(todo);
    await createdTodo.save();
    console.log('event stored in mongo. id: ' + createdTodo._id);
  }
}
