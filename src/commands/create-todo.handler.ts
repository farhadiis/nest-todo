import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoCommand } from './create-todo.command';
import { EventStoreDbService } from '../services/event-store-db.service';

@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(private readonly eventStoreDbService: EventStoreDbService) {}

  async execute(command: CreateTodoCommand) {
    console.log('CreateTodoCommand...');
    const { text } = command;
    await this.eventStoreDbService.publish(text);
  }
}
