import { Injectable, Logger } from '@nestjs/common';
import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';

import { randomUUID } from 'crypto';
import { Queue, Job as QueueJob } from 'bull';

import { Job } from './job.entity';

@Injectable()
@Processor('jobs')
export class JobService {
  private readonly logger = new Logger(JobService.name);
  constructor(@InjectQueue('jobs') private readonly queue: Queue) {}

  async add(job: Omit<Job, 'id'>) {
    const id = randomUUID();
    await this.queue.add('job', job, {
      jobId: id,
      removeOnComplete: true,
      removeOnFail: true,
    });
    return id as string;
  }

  @Process('job')
  async process(job: QueueJob<Omit<Job, 'id'>>) {
    this.logger.log(`Processing job ${job.id}`);

    // let's just pretend there's a very expensive task here
    await new Promise((resolve) => setTimeout(resolve, 5000));

    switch (job.data.operation) {
      case 'add':
        return job.data.data.reduce((acc, cur) => acc + cur);
      case 'subtract':
        return job.data.data.reduce((acc, cur) => acc - cur);
      case 'multiply':
        return job.data.data.reduce((acc, cur) => acc * cur);
      case 'divide':
        return job.data.data.reduce((acc, cur) => acc / cur);
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: QueueJob<Omit<Job, 'id'>>) {
    this.logger.log(`Job ${job.id} completed with result ${job.returnvalue}`);
  }

  @OnQueueFailed()
  async onFailed(job: QueueJob<Job>, error: Error) {
    this.logger.error(
      error,
      `Job ${job.id} failed with error ${error.message}`,
    );
  }
}
