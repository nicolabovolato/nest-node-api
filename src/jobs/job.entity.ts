export type Job = {
  id: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  data: number[];
};

export type JobResult = number;
