import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { CreateShortenerDto } from './dto/request/create-shortener.dto';
import { UpdateShortenerDto } from './dto/request/update-shortener.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthVerifyHeaderGuard } from 'src/auth/auth.secondary.guard';

@Controller('shortener')
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) { }

  @UseGuards(AuthVerifyHeaderGuard)
  @Post()
  create(@Body() createShortenerDto: CreateShortenerDto, @Request() req) {
    const userLogged = req?.user?.id
    return this.shortenerService.create(createShortenerDto, userLogged);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShortenerDto: UpdateShortenerDto, @Request() req) {
    const userLogged = req?.user?.id
    return this.shortenerService.update(+id, updateShortenerDto, userLogged);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userLogged = req?.user?.id
    return this.shortenerService.remove(+id, userLogged);
  }
}
