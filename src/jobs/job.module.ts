import { Module } from '@nestjs/common';

import { QueueModule } from 'src/queue/queue.module';

import { JobService } from './job.service';
import { JobController } from './job.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    QueueModule,
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
