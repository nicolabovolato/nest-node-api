import { Injectable } from '@nestjs/common';

import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todos: TodoRepository) {}

  async getAll(limit: number, offset: number) {
    return await this.todos.getAll(limit, offset);
  }

  async getById(id: Todo['id']) {
    return await this.todos.getById(id);
  }

  async create(todo: Omit<Todo, 'id' | 'created_at'>) {
    return await this.todos.create(todo);
  }

  async update(todo: Omit<Todo, 'created_at'>) {
    return await this.todos.update(todo);
  }

  async delete(id: Todo['id']) {
    return await this.todos.delete(id);
  }
}
