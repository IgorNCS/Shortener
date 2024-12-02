import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from './dto/response/response-user.dto';
import * as bcrypt from 'bcryptjs';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private modelRepository: Repository<User>,
    private readonly clsService: ClsService,
  ){}


  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new ConflictException(
          'As senhas não coincidem. Por favor, digite a senha e a confirmação novamente.',
        );
      }
  
      const existUser = await this.modelRepository.findOne({
        where: { email: createUserDto.email },
      });
  
      if (existUser) {
        throw new ConflictException(
          'Este email já está cadastrado. Faça login ou recupere sua senha.',
        );
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      createUserDto.password = hashedPassword;
  
      const newUser = await this.modelRepository.save(createUserDto);
      console.log(newUser);
  
      return plainToClass(ResponseUserDto, newUser, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    } catch (error) {
      console.log(error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro ao criar o usuário. Por favor, tente novamente mais tarde.',
      );
    }
  }
  

  async findByEmail(email:string) {
    try {

      const existUser = await this.modelRepository.findOne({
        where: { email: email },
      });

      if (!existUser) {
        throw new NotFoundException(
          'Email não cadastrado!',
        );
      }
      return existUser

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar o usuário. Por favor, tente novamente mais tarde.',
      );
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    try {
      const userId = this.clsService.get('user');
      const user = await this.modelRepository.findOne({ where: { id: userId.id } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (updateUserDto.newPassword) {
        if (updateUserDto.newPassword !== updateUserDto.confirmNewPassword) {
          throw new ConflictException('As senhas não coincidem');
        }

        const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
        user.password = hashedPassword;
      }

      if (updateUserDto.email) {
        user.email = updateUserDto.email;
      }

      if (updateUserDto.newPassword) {
        user.password = updateUserDto.newPassword;
      }

      await this.modelRepository.save(user);

      const updatedUser = await this.modelRepository.findOne({ where: { id: user.id } });

      return plainToClass(ResponseUserDto, updatedUser, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao atualizar o usuário');
    }
  }

  async remove(): Promise<void> {
    try {
      const userId = this.clsService.get('user');
      const user = await this.modelRepository.findOne({ where: { id: userId.id } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.modelRepository.delete(user);


    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao remover o usuário');
    }
  }
}
