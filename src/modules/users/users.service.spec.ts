import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ClsService } from 'nestjs-cls';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ResponseUserDto } from './dto/response/response-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let modelRepository: Repository<User>;
  let clsService: ClsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ClsService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    modelRepository = module.get<Repository<User>>(getRepositoryToken(User));
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name:"Fulano de Tal",
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const savedUser = {
        id: 1,
        name:"Fulano de Tal",
        email: createUserDto.email,
        password: hashedPassword,
      };

      jest.spyOn(modelRepository, 'findOne').mockResolvedValue(null); // No user exists
      jest.spyOn(modelRepository, 'save').mockResolvedValue({
        id: 1,
        name: "Fulano de Tal",
        email: createUserDto.email,
        password: hashedPassword,
      } as unknown as User);

      const result = await service.create(createUserDto);

      expect(modelRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
      expect(modelRepository.save).toHaveBeenCalledWith(expect.objectContaining({ email: createUserDto.email }));
      expect(result).toBeInstanceOf(ResponseUserDto);
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw a ConflictException if passwords do not match', async () => {
      const createUserDto: CreateUserDto = {
        name:"Fulano de Tal",
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password456',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw a ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name:"Fulano de Tal",
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      jest.spyOn(modelRepository, 'findOne').mockResolvedValue({ id: 1, email: createUserDto.email } as User);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if email exists', async () => {
      const email = 'test@example.com';
      const existingUser = { id: 1, email };

      jest.spyOn(modelRepository, 'findOne').mockResolvedValue(existingUser as User);

      const result = await service.findByEmail(email);

      expect(modelRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(existingUser);
    });

    it('should throw NotFoundException if email does not exist', async () => {
      const email = 'nonexistent@example.com';

      jest.spyOn(modelRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findByEmail(email)).rejects.toThrow(NotFoundException);
    });
  });
});
