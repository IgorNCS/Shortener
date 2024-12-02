import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB,
      port: parseInt(process.env.PORT_DB),
      username: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
      synchronize: false,
      autoLoadEntities: true,
    }),
    JwtModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
