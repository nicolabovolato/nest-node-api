import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: DeepMocked<TodoService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: createMock<TodoService>(),
        },
      ],
    }).compile();

    todoService = moduleRef.get(TodoService);
    todoController = moduleRef.get(TodoController);
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
      todoService.getAll.mockResolvedValue(todos);

      expect(await todoController.getAll({ limit: 10, offset: 20 })).toEqual(
        todos,
      );

      expect(todoService.getAll).toBeCalledWith(10, 20);
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

      todoService.getById.mockResolvedValue(todo);

      expect(await todoController.getById({ id: todo.id })).toEqual(todo);

      expect(todoService.getById).toBeCalledWith(todo.id);
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

      todoService.create.mockResolvedValue(todo);

      expect(await todoController.create(requestTodo)).toEqual(todo);

      expect(todoService.create).toBeCalledWith(requestTodo);
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

      const { id, created_at, ...requestTodo } = todo;

      todoService.update.mockResolvedValue(todo);

      expect(await todoController.update({ id }, requestTodo)).toEqual(todo);

      expect(todoService.update).toBeCalledWith({ id, ...requestTodo });
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

      todoService.delete.mockResolvedValue(todo);

      expect(await todoController.delete({ id: todo.id })).toEqual(todo);

      expect(todoService.delete).toBeCalledWith(todo.id);
    });
  });
});
