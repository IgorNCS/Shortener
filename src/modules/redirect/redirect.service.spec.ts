import { Test, TestingModule } from '@nestjs/testing';
import { RedirectService } from './redirect.service';
import { ShortenerService } from '../shortener/shortener.service';
import { NotFoundException } from '@nestjs/common';
import { Shortener } from '../shortener/entities/shortener.entity';

describe('RedirectService', () => {
  let service: RedirectService;
  let shortenerService: ShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectService,
        {
          provide: ShortenerService,
          useValue: {
            findByShortenedUrl: jest.fn(),
            incrementClicks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
    shortenerService = module.get<ShortenerService>(ShortenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('redirectToOriginalUrl', () => {
    it('should return the original URL and increment clicks', async () => {
      const shortenedURL = 'abc123';
      const originalURL = 'http://example.com';

      jest.spyOn(service, 'getOriginalUrl').mockResolvedValue(originalURL);
      jest.spyOn(shortenerService, 'incrementClicks').mockResolvedValue();

      const result = await service.redirectToOriginalUrl(shortenedURL);

      expect(service.getOriginalUrl).toHaveBeenCalledWith(shortenedURL);
      expect(shortenerService.incrementClicks).toHaveBeenCalledWith(shortenedURL);
      expect(result).toBe(originalURL);
    });

    it('should throw NotFoundException if URL is not found', async () => {
      const shortenedURL = 'notfound';

      jest.spyOn(service, 'getOriginalUrl').mockRejectedValue(new NotFoundException());

      await expect(service.redirectToOriginalUrl(shortenedURL)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL if found', async () => {
      const shortenedURL = 'abc123';
      const shortener = {
        id: 1,
        originalURL: 'http://example.com',
        shortenedURL: 'abc123',
        clicks: 1,
        user_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Shortener;

      jest.spyOn(shortenerService, 'findByShortenedUrl').mockResolvedValue(shortener);

      const result = await service.getOriginalUrl(shortenedURL);

      expect(shortenerService.findByShortenedUrl).toHaveBeenCalledWith(shortenedURL);
      expect(result).toBe(shortener.originalURL);
    });

    it('should throw NotFoundException if URL is not found', async () => {
      const shortenedURL = 'notfound';

      jest.spyOn(shortenerService, 'findByShortenedUrl').mockResolvedValue(null);

      await expect(service.getOriginalUrl(shortenedURL)).rejects.toThrow(NotFoundException);
    });
  });
});
