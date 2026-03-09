export interface EnvironmentConfig {
  database: {
    url: string;
  };
  port: number;
  env: string;
}

export default (): EnvironmentConfig => ({
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://user:password@localhost:5432/mydb',
  },
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
});
