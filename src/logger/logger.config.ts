import { version } from '../../package.json';

export type Config = {
  level: string;
  version: string;
};

export default (): Config => ({
  level: process.env.LOG_LEVEL || 'info',
  version,
});
