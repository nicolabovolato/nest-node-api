export type Config = {
  connectionString: string;
  timeoutMs: number;
};

export default (): Config => ({
  connectionString:
    process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db',
  timeoutMs: Number(process.env.DATABASE_TIMEOUT_MS || 5000),
});
