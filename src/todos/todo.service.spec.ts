import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { Todo } from './todo.entity';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: DeepMocked<TodoRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: TodoRepository,
          useValue: createMock<TodoRepository>(),
        },
        TodoService,
      ],
    }).compile();

    todoService = moduleRef.get(TodoService);
    todoRepository = moduleRef.get(TodoRepository);
  });

  describe('getAll', () => {
    it('should return an array of todos', async () => {
      const todos: Todo[] = [
        {
          id: 'id',
          completed: false,
          created_at: new Date(),
          description: 'description',
          title: 'title',
        },
      ];

      todoRepository.getAll.mockResolvedValue(todos);

      expect(await todoService.getAll(10, 20)).toEqual(todos);

      expect(todoRepository.getAll).toBeCalledWith(10, 20);
    });
  });

  describe('getById', () => {
    it('should return a todo', async () => {
      const todo: Todo = {
        id: 'id',
        completed: false,
        created_at: new Date(),
        description: 'description',
        title: 'title',
      };

      todoRepository.getById.mockResolvedValue(todo);

      expect(await todoService.getById(todo.id)).toEqual(todo);

      expect(todoRepository.getById).toBeCalledWith(todo.id);
    });
  });

  describe('create', () => {
    it('should return created todo', async () => {
      const todo: Todo = {
        id: 'id',
        completed: false,
        created_at: new Date(),
        description: 'description',
        title: 'title',
      };

      const { id, created_at, ...requestTodo } = todo;

      todoRepository.create.mockResolvedValue(todo);

      expect(await todoService.create(requestTodo)).toEqual(todo);

      expect(todoRepository.create).toBeCalledWith(requestTodo);
    });
  });

  describe('update', () => {
    it('should return updated todo', async () => {
      const todo: Todo = {
        id: 'id',
        completed: false,
        created_at: new Date(),
        description: 'description',
        title: 'title',
      };

      const { created_at, ...requestTodo } = todo;

      todoRepository.update.mockResolvedValue(todo);

      expect(await todoService.update(requestTodo)).toEqual(todo);

      expect(todoRepository.update).toBeCalledWith(requestTodo);
    });
  });

  describe('delete', () => {
    it('should return deleted todo', async () => {
      const todo: Todo = {
        id: 'id',
        completed: false,
        created_at: new Date(),
        description: 'description',
        title: 'title',
      };

      todoRepository.delete.mockResolvedValue(todo);

      expect(await todoService.delete(todo.id)).toEqual(todo);

      expect(todoRepository.delete).toBeCalledWith(todo.id);
    });
  });
});
