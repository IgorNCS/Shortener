import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { Shortener } from './entities/shortener.entity';
import { User } from '../users/entities/user.entity';

describe('ShortenerService', () => {
  let service: ShortenerService;
  let shortenerRepository: Repository<Shortener>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenerService,
        {
          provide: getRepositoryToken(Shortener),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShortenerService>(ShortenerService);
    shortenerRepository = module.get<Repository<Shortener>>(getRepositoryToken(Shortener));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if shortenerURL already exists', async () => {
      jest.spyOn(service, 'findByShortenedUrl').mockResolvedValue({} as Shortener);

      await expect(
        service.create({ shortenerURL: 'existing-url', originalURL: 'http://example.com' }, 1),
      ).rejects.toThrow(ConflictException);
    });


    it('should throw BadRequestException if originalURL is not provided', async () => {
      await expect(
        service.create({ shortenerURL: 'new-url', originalURL: undefined }, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should save and return the new shortener', async () => {
      jest.spyOn(service, 'findByShortenedUrl').mockResolvedValue(null);
      jest.spyOn(shortenerRepository, 'save').mockResolvedValue({
        id: 1,
        shortenerURL: 'short-url',
        originalURL: 'http://example.com',
        user_id: { id: 1 },
      } as Shortener);
    
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 1,
        email: 'teste@email.com',
      } as User);
    
      const result = await service.create(
        { originalURL: 'http://example.com' },
        1,
      );
    
      expect(shortenerRepository.save).toHaveBeenCalled();
      expect(result.shortenerURL).toContain('short-url');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if shortener does not exist', async () => {
      jest.spyOn(shortenerRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(1, { originalURL: 'http://new-url.com' }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      jest.spyOn(shortenerRepository, 'findOne').mockResolvedValue({
        id: 1,
        user_id: { id: 2 },
      } as Shortener);

      await expect(
        service.update(1, { originalURL: 'http://new-url.com' }, 1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update the shortener', async () => {
      jest.spyOn(shortenerRepository, 'findOne').mockResolvedValue({
        id: 1,
        user_id: { id: 1 },
      } as Shortener);
      jest.spyOn(shortenerRepository, 'update').mockResolvedValue({} as any);

      const result = await service.update(1, { originalURL: 'http://new-url.com' }, 1);

      expect(shortenerRepository.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if shortener does not exist', async () => {
      jest.spyOn(shortenerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      jest.spyOn(shortenerRepository, 'findOne').mockResolvedValue({
        id: 1,
        user_id: { id: 2 },
      } as Shortener);

      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should remove the shortener', async () => {
      jest.spyOn(shortenerRepository, 'findOne').mockResolvedValue({
        id: 1,
        user_id: { id: 1 },
      } as Shortener);
      jest.spyOn(shortenerRepository, 'remove').mockResolvedValue({} as any);

      const result = await service.remove(1, 1);

      expect(shortenerRepository.remove).toHaveBeenCalled();
      expect(result.message).toBe('Shortener excluído com sucesso');
    });
  });
});
