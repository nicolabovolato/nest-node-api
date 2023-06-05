import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { patchNestJsSwagger } from 'nestjs-zod';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import config, { Config } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const { openapi, port } = app.get<Config>(config.KEY);
  const logger = app.get<Logger>(Logger);

  if (openapi) {
    patchNestJsSwagger();
    SwaggerModule.setup(
      'documentation',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('NestJS Service')
          .addBearerAuth()
          .build(),
      ),
    );
  }

  await app.listen(port, '::');

  logger.log(`Listening on http://[::]:${port}`);
  if (openapi) {
    logger.log(`SwaggerUI hosted at http://[::]:${port}/documentation`);
  }
}
bootstrap();
