import { Shortener } from '../modules/shortener/entities/shortener.entity';
import { User } from '../modules/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  entities: [User, Shortener],
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
  migrations: ['./migrations/*.ts'],
});
