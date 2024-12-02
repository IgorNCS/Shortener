import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { Response } from 'express';

describe('RedirectController', () => {
  let controller: RedirectController;
  let service: RedirectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: RedirectService,
          useValue: {
            redirectToOriginalUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
    service = module.get<RedirectService>(RedirectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL', async () => {
      const shortenedURL = 'abc123';
      const originalURL = 'http://example.com';
      const mockRes = {
        setHeader: jest.fn(),
      } as unknown as Response;

      jest.spyOn(service, 'redirectToOriginalUrl').mockResolvedValue(originalURL);

      const result = await controller.redirectToOriginalUrl(shortenedURL, mockRes);

      expect(service.redirectToOriginalUrl).toHaveBeenCalledWith(shortenedURL);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
      expect(result).toEqual({ url: originalURL });
    });
  });
});
