import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { getQueueToken } from '@nestjs/bull';

import { Queue, Job as QueueJob } from 'bull';

import { JobService } from './job.service';
import { Job } from './job.entity';

describe('JobService', () => {
  let jobsService: JobService;
  let queue: DeepMocked<Queue>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getQueueToken('jobs'),
          useValue: createMock<Queue>(),
        },
        JobService,
      ],
    }).compile();

    queue = moduleRef.get(getQueueToken('jobs'));
    jobsService = moduleRef.get(JobService);
  });

  describe('add', () => {
    it('should return an id', async () => {
      const job: Omit<Job, 'id'> = {
        data: [10, 20],
        operation: 'add',
      };
      const id = await jobsService.add(job);

      expect(queue.add).toBeCalledWith('job', job, {
        jobId: id,
        removeOnComplete: true,
        removeOnFail: true,
      });
    });
  });

  describe('process', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it.each([
      [[1, 2, 3], 'add', 6],
      [[3, 2, 1], 'subtract', 0],
      [[4, 2, 3], 'multiply', 24],
      [[4, 2, 1], 'divide', 2],
    ] as const)('%s -> %s = %d', async (data, operation, result) => {
      const job: Omit<Job, 'id'> = {
        operation,
        data: [...data],
      };

      const promise = jobsService.process({ data: job } as unknown as QueueJob<
        Omit<Job, 'id'>
      >);

      await jest.advanceTimersByTimeAsync(5000);

      expect(await promise).toEqual(result);
    });
  });
});
