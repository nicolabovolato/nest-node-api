import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const body = z.object({
  sub: z.string(),
  role: z.union([z.literal('user'), z.literal('admin')]),
});

const tokenResponse = z.object({
  token: z.string(),
});

const protectedResponse = z.object({
  message: z.string(),
});

const params = z.object({
  email: z.string().email(),
});

export class BodyDto extends createZodDto(body) {}
export class TokenResponseDto extends createZodDto(tokenResponse) {}
export class ProtectedResponseDto extends createZodDto(protectedResponse) {}
export class ParamsDto extends createZodDto(params) {}

export const paramsSchema: SchemaObject = zodToOpenAPI(params);
