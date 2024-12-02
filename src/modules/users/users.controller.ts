import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.log(error)
      if (error.response?.statusCode === 409) {
        throw new BadRequestException(error.response.message);
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.',
      );
    }
  }

  @Patch('')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete('')
  remove() {
    return this.usersService.remove();
  }
}
