import { Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

import { JobController } from './job.controller';
import { JobService } from './job.service';
import { Job } from './job.entity';

describe('JobController', () => {
  let jobController: JobController;
  let jobService: DeepMocked<JobService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: createMock<JobService>(),
        },
      ],
    }).compile();

    jobService = moduleRef.get(JobService);
    jobController = moduleRef.get(JobController);
  });

  describe('create', () => {
    it('should return a job id', async () => {
      const job: Omit<Job, 'id'> = {
        data: [10, 20],
        operation: 'add',
      };

      jobService.add.mockResolvedValue('id');

      expect(await jobController.create(job)).toEqual({ id: 'id' });

      expect(jobService.add).toBeCalledWith(job);
    });
  });
});
