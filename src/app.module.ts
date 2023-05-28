import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { AppController } from './app.controller';
import appConfig from './app.config';

import { LoggerModule } from './logger/logger.module';
import { TodoModule } from './todos/todo.module';
import { SettingModule } from './settings/setting.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    LoggerModule,
    TodoModule,
    SettingModule,
    RouterModule.register([
      {
        path: 'v1',
        children: [
          { path: 'todos', module: TodoModule },
          { path: 'settings', module: SettingModule },
        ],
      },
    ]),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule {}
