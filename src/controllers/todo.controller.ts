import { Controller, Post, Body } from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    await this.todoService.create(createTodoDto);
  }
}
