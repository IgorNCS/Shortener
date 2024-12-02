import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectController } from './redirect.controller';
import { ShortenerService } from '../shortener/shortener.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shortener } from '../shortener/entities/shortener.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Shortener,User])],
  controllers: [RedirectController],
  providers: [RedirectService,ShortenerService],
})
export class RedirectModule {}
