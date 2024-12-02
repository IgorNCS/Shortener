import { Injectable, NotFoundException } from '@nestjs/common';
import { ShortenerService } from '../shortener/shortener.service';

@Injectable()
export class RedirectService {
  constructor(
    private readonly shortenerService: ShortenerService,
  ) { }

  async redirectToOriginalUrl(shortenedURL: string): Promise<string> {
    try {
      const originalUrl = await this.getOriginalUrl(shortenedURL);
      await this.shortenerService.incrementClicks(shortenedURL);
      return originalUrl;


    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro inesperado ao redirecionar para a URL original.');
    }
  }

  async getOriginalUrl(shortenedUrl: string): Promise<string> {
    const shortener = await this.shortenerService.findByShortenedUrl(shortenedUrl);
    if (!shortener) {
      throw new NotFoundException('URL Not Found');
    }

    return shortener.originalURL;
  }

}
