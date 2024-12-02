import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShortenerDto } from './dto/request/create-shortener.dto';
import { UpdateShortenerDto } from './dto/request/update-shortener.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

import { ClsService } from 'nestjs-cls';
import { UsersService } from '../users/users.service';
import { plainToClass } from 'class-transformer';
import { ResponseShortenerDto } from './dto/response/response-shortener.dto';
import { Shortener } from './entities/shortener.entity';

@Injectable()
export class ShortenerService {
  constructor(
    @InjectRepository(Shortener)
    private modelRepository: Repository<Shortener>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly clsService: ClsService,
  ) { }


  async create(createShortenerDto: CreateShortenerDto, userLogged?: number) {
    try {
      if (createShortenerDto.shortenerURL) {
        const existShortenerURL = await this.findByShortenedUrl(createShortenerDto.shortenerURL);

        if (existShortenerURL) {
          throw new ConflictException('URL encurtada já existente, tente outro.');
        }
      } else {
        createShortenerDto.shortenerURL = await this.generateUniqueShortenedUrl();
      }

      if (!createShortenerDto.originalURL) {
        throw new BadRequestException('Original URL é obrigatória');
      }

      let newShortener = await this.modelRepository.save(createShortenerDto);

      if (userLogged) {
        const user = await this.userRepository.findOne({ where: { id: userLogged } });
        if (user) {
          newShortener.user_id = user;
          await this.modelRepository.save(newShortener);
        } else {
          throw new NotFoundException('Usuário não encontrado');
        }
      }

      newShortener.shortenerURL = process.env.URL_LOCAL + newShortener.shortenerURL;

      return plainToClass(ResponseShortenerDto, newShortener, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
        
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar o shortener');
    }
  }


  async update(id: number, updateShortenerDto: UpdateShortenerDto, userLogged: number) {
    try {
      const shortener = await this.modelRepository.findOne({ where: { id } });

      if (!shortener) {
        throw new NotFoundException('URL encurtada não encontrada');
      }

      if (shortener.user_id.id !== userLogged) {
        throw new ForbiddenException('Você não tem permissão para editar essa URL encurtada');
      }

      await this.modelRepository.update(id, updateShortenerDto);

      return await this.modelRepository.findOne({ where: { id } });

    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException 
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar o shortener');
    }
  }

  async remove(id: number, userLogged: number) {
    try {
      const shortener = await this.modelRepository.findOne({ where: { id: id, user_id: { id: userLogged } } });

      if (!shortener) {
        throw new NotFoundException('URL encurtada não encontrada');
      }

      if (shortener.user_id.id !== userLogged) {
        throw new ForbiddenException('Você não tem permissão para excluir essa URL encurtada');
      }

      await this.modelRepository.remove(shortener);

      return { message: 'Shortener excluído com sucesso' };

    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover o shortener');
    }
  }

  async incrementClicks(shortenedURL: string): Promise<void> {
    try {
      const shortener = await this.modelRepository.findOne({ where: { shortenerURL: shortenedURL } });

      if (!shortener) {
        throw new Error('URL encurtada não encontrada');
      }

      shortener.clicks += 1;

      await this.modelRepository.save(shortener);

    } catch (error) {
      console.error('Erro ao incrementar o número de cliques:', error);
    }
  }

  async findByShortenedUrl(shortenedUrl): Promise<Shortener> {
    return await this.modelRepository.findOne({ where: { shortenerURL: shortenedUrl } });
  }

  private async generateUniqueShortenedUrl(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortenedUrl = '';

    while (true) {
      for (let i = 0; i < Math.ceil(Math.random() * 6); i++) {
        shortenedUrl += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const existingShortenedUrl = await this.findByShortenedUrl(shortenedUrl);
      if (!existingShortenedUrl) {
        break
      }

    }



    return shortenedUrl;
  }

}
