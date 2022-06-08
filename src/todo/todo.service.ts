import { Injectable } from '@nestjs/common';
import { Todo } from './interfaces/todo';

@Injectable()
export class TodoService {
  create(todo: Todo) {
    console.log(todo);
  }
}
