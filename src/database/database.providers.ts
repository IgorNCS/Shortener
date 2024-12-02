
import { Shortener } from '../modules/shortener/entities/shortener.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [
            User,Shortener
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
// __dirname + '/../**/*.entity{.ts,.js}'