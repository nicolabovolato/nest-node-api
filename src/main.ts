import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { patchNestJsSwagger } from 'nestjs-zod';

import { LoggerService } from './logger/logger.service';
import { AppModule } from './app.module';
import appconfig, { Config } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(LoggerService));
  app.enableShutdownHooks();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get<Config>(appconfig.KEY);
  const logger = app.get<LoggerService>(LoggerService);

  if (config.openapi) {
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

  await app.listen(config.port, '::');

  logger.log(`Listening on http://[::]:${config.port}`);
  if (config.openapi) {
    logger.log(`SwaggerUI hosted at http://[::]:${config.port}/documentation`);
  }
}
bootstrap();
