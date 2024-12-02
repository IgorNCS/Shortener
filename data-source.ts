import { Shortener } from './src/modules/shortener/entities/shortener.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [User, Shortener], 
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',  // Apenas true em dev
  migrations: ['src/migrations/*.ts'],
});
