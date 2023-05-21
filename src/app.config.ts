export type Config = {
  port: number;
  openapi: boolean;
};

export default (): Config => ({
  port: Number(process.env.PORT || 80),
  openapi: !!process.env.EXPOSE_OPENAPI || process.env.NODE_ENV != 'production',
});
