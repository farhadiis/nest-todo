import { Injectable } from '@nestjs/common';
import { Todo, TodoDocument } from '../models/todo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTodoCommand } from '../commands/create-todo.command';
import { CreateTodoDto } from '../controllers/dto/create-todo.dto';
import { TodoEvent } from './event-store-db.service';

@Injectable()
export class TodoService {
  constructor(
    private readonly commandBus: CommandBus,
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  ) {}

  async create(todo: CreateTodoDto) {
    return this.commandBus.execute(new CreateTodoCommand(todo.text));
  }

  async store(event: TodoEvent) {
    const createdTodo = new this.todoModel(event);
    await createdTodo.save();
    console.log('event stored in mongo. id: ' + createdTodo._id);
  }
}
