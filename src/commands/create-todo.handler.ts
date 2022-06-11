import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoCommand } from './create-todo.command';
import { EventStoreDbService } from '../services/event-store-db.service';
import { TodoCreatedEvent } from '../events/todo-created.event';

@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(
    private readonly eventStoreDbService: EventStoreDbService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTodoCommand) {
    console.log('CreateTodoCommand...');

    const { text } = command;
    await this.eventStoreDbService.recordEvent(text);

    // const hero = this.publisher.mergeObjectContext(
    //   await this.repository.findOneById(+heroId),
    // );
    // // hero.killEnemy(dragonId);
    // hero.commit();

    this.eventBus.publish(new TodoCreatedEvent(text));
  }
}
