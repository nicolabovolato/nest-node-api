import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import appConfig from './app.config';

import { LoggerModule } from 'nestjs-pino';
import loggerConfig, { Config as LoggerConfig } from './logger/logger.config';

import { PrismaModule } from 'nestjs-prisma';
import dbConfig, { Config as DbConfig } from './db/db.config';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    LoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(loggerConfig)],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<LoggerConfig>) => ({
        pinoHttp: {
          level: config.getOrThrow('level'),
          name: config.getOrThrow('version'),
        },
        useExisting: true,
      }),
    }),
    PrismaModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<DbConfig>) => ({
        prismaOptions: {
          datasources: {
            db: { url: config.getOrThrow('connectionString') },
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
