import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/db/db.service';

import { Todo } from './todo.entity';

@Injectable()
export class TodoRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAll(limit: number, offset: number): Promise<Todo[]> {
    return await this.db.todo.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getById(id: Todo['id']): Promise<Todo> {
    return await this.db.todo.findFirstOrThrow({ where: { id } });
  }

  async create(todo: Omit<Todo, 'id' | 'created_at'>): Promise<Todo> {
    return await this.db.todo.create({ data: todo });
  }

  async update(todo: Omit<Todo, 'created_at'>): Promise<Todo> {
    return await this.db.todo.update({ where: { id: todo.id }, data: todo });
  }

  async delete(id: Todo['id']): Promise<Todo> {
    return await this.db.todo.delete({ where: { id } });
  }
}
