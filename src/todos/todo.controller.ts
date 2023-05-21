import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ZodSerializerDto } from 'nestjs-zod';

import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import {
  BodyDto,
  GetAllResponseDto,
  ParamsDto,
  QueryDto,
  ResponseDto,
  paramsSchema,
  querySchema,
} from './todo.dto';

@ApiTags('todos')
@Controller()
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Get()
  @ZodSerializerDto(ResponseDto) // For some reason GetAllResponseDto would not work here
  @ApiQuery({ name: 'offset', schema: querySchema.properties!.offset })
  @ApiQuery({ name: 'limit', schema: querySchema.properties!.limit })
  @ApiOkResponse({
    type: GetAllResponseDto,
  })
  async getAll(@Query() { limit, offset }: QueryDto): Promise<Todo[]> {
    return await this.service.getAll(limit, offset);
  }

  @Get(':id')
  @ZodSerializerDto(ResponseDto)
  @ApiParam({ name: 'id', schema: paramsSchema.properties!.id as SchemaObject })
  @ApiOkResponse({
    type: ResponseDto,
  })
  async getById(@Param() { id }: ParamsDto): Promise<Todo> {
    return await this.service.getById(id);
  }

  @Post()
  @ZodSerializerDto(ResponseDto)
  @ApiCreatedResponse({
    type: ResponseDto,
  })
  async create(@Body() todo: BodyDto): Promise<Todo> {
    return await this.service.create(todo);
  }

  @Put(':id')
  @ZodSerializerDto(ResponseDto)
  @ApiParam({ name: 'id', schema: paramsSchema.properties!.id as SchemaObject })
  @ApiOkResponse({
    type: ResponseDto,
  })
  async update(
    @Param() { id }: ParamsDto,
    @Body() todo: BodyDto,
  ): Promise<Todo> {
    return await this.service.update({ ...todo, id });
  }

  @Delete(':id')
  @ZodSerializerDto(ResponseDto)
  @ApiParam({ name: 'id', schema: paramsSchema.properties!.id as SchemaObject })
  @ApiOkResponse({
    type: ResponseDto,
  })
  async delete(@Param() { id }: ParamsDto): Promise<Todo> {
    return await this.service.delete(id);
  }
}
