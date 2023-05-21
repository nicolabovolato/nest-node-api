import { Module } from '@nestjs/common';

import { PrismaModule } from 'nestjs-prisma';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TodoController],
  providers: [TodoRepository, TodoService],
})
export class TodoModule {}
