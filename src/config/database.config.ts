import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));



