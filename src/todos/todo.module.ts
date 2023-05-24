import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/db/db.module';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
  providers: [TodoRepository, TodoService],
})
export class TodoModule {}
