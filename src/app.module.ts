import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ShortenerModule } from './modules/shortener/shortener.module';
import { AuthModule } from './auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RedirectModule } from './modules/redirect/redirect.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.MYSQL_HOST,
    //   port: parseInt(process.env.MYSQL_PORT),
    //   username: process.env.MYSQL_USERNAME,
    //   password: process.env.MYSQL_PASSWORD,
    //   database: process.env.MYSQL_DATABASE_NAME,
    //   synchronize: false,
    //   autoLoadEntities: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,  // Aqui usamos o nome do serviço do MySQL no Docker Compose
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE_NAME,
      synchronize: process.env.MYSQL_SYNCHRONIZE === 'true', // Certifique-se de que o valor seja tratado como booleano
      autoLoadEntities: true,
    }),
    
    UsersModule,
    ShortenerModule,
    AuthModule,
    JwtModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    RedirectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
