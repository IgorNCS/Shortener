import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { Shortener } from './entities/shortener.entity';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([Shortener,User])],
  controllers: [ShortenerController],
  providers: [ShortenerService,JwtService],
})
export class ShortenerModule {}
