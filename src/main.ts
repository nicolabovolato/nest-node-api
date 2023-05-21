import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Logger } from 'nestjs-pino';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app.module';
import { Config } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(Logger));

  const config = app.get<ConfigService<Config>>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const openapi = config.getOrThrow('openapi', { infer: true });

  if (openapi) {
    patchNestJsSwagger();
    SwaggerModule.setup(
      'documentation',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder().setTitle('NestJS Service').build(),
      ),
    );
  }

  const port = config.getOrThrow('port', { infer: true });

  await app.listen(port, '::');

  logger.log(`Listening on http://[::]:${port}`);
  if (openapi) {
    logger.log(`SwaggerUI hosted at http://[::]:${port}/documentation`);
  }
}
bootstrap();
