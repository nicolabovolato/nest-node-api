import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { PrismaService } from 'nestjs-prisma';

import { TodoRepository } from './todo.repository';
import { Todo } from './todo.entity';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;
  let databaseService: DeepMocked<PrismaService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: createMock<PrismaService>({
            // createMock really works wonders! >:(
            todo: {
              findMany: jest.fn(),
              findFirstOrThrow: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          }),
        },
        TodoRepository,
      ],
    }).compile();

    todoRepository = moduleRef.get(TodoRepository);
    databaseService = moduleRef.get(PrismaService);
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
      jest.mocked(databaseService.todo.findMany).mockResolvedValue(todos);

      expect(await todoRepository.getAll(10, 20)).toEqual(todos);

      expect(databaseService.todo.findMany).toBeCalledWith({
        take: 10,
        skip: 20,
        orderBy: {
          created_at: 'desc',
        },
      });
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

      jest
        .mocked(databaseService.todo.findFirstOrThrow)
        .mockResolvedValue(todo);

      expect(await todoRepository.getById(todo.id)).toEqual(todo);

      expect(databaseService.todo.findFirstOrThrow).toBeCalledWith({
        where: { id: todo.id },
      });
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

      jest.mocked(databaseService.todo.create).mockResolvedValue(todo);

      expect(await todoRepository.create(requestTodo)).toEqual(todo);

      expect(databaseService.todo.create).toBeCalledWith({
        data: requestTodo,
      });
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

      jest.mocked(databaseService.todo.update).mockResolvedValue(todo);

      expect(await todoRepository.update(requestTodo)).toEqual(todo);

      expect(databaseService.todo.update).toBeCalledWith({
        where: { id: requestTodo.id },
        data: requestTodo,
      });
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

      jest.mocked(databaseService.todo.delete).mockResolvedValue(todo);

      expect(await todoRepository.delete(todo.id)).toEqual(todo);

      expect(databaseService.todo.delete).toBeCalledWith({
        where: { id: todo.id },
      });
    });
  });
});
