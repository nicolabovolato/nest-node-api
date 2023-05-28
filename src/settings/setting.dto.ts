import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const response = z.object({
  value: z.union([z.string().min(1).max(256), z.null()]),
});

const params = z.object({
  id: z.string().min(4).max(64),
});

export class SettingDto extends createZodDto(response) {}
export class ParamsDto extends createZodDto(params) {}

export const paramsSchema: SchemaObject = zodToOpenAPI(params);
