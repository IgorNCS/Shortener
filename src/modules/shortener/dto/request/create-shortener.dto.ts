import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenerDto {
    @ApiProperty({
        description: 'The original URL to be shortened',
        example: 'https://www.example.com',
    })
    @IsString()
    @IsNotEmpty()
    originalURL: string;

    @ApiProperty({
        description: 'The shortened URL',
        example: 'abc123',
    })
    @IsString()
    @IsOptional()
    shortenerURL?: string;

}
