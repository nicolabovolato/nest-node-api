import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const response = z.object({
  id: z.string().uuid(),
  title: z.string().max(256),
  description: z.string(),
  completed: z.boolean(),
});

const getAllResponse = z.array(response);

const params = response.pick({ id: true });

const body = response.omit({ id: true });

const query = z.object({
  limit: z.coerce.number().int().min(10).max(100),
  offset: z.coerce.number().int().min(0),
});

export class QueryDto extends createZodDto(query) {}
export class ResponseDto extends createZodDto(response) {}
export class GetAllResponseDto extends createZodDto(getAllResponse) {}
export class ParamsDto extends createZodDto(params) {}
export class BodyDto extends createZodDto(body) {}

export const paramsSchema: SchemaObject = zodToOpenAPI(params);
export const querySchema: SchemaObject = zodToOpenAPI(query);
