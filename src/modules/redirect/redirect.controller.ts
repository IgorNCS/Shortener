import { Controller, Get, HttpStatus, Param, Redirect, Req, Res } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('')
export class RedirectController {
    constructor(private redirectService: RedirectService) { }

    @ApiParam({ name: 'shortenedUrl', description: 'A URL encurtada.', example:'QVU' })
    @ApiResponse({  status:301,
        description:"Redirecionado para URL."
    })
    @ApiOperation({
        summary:'Redirecionar para URL.',
        description:'Redireciona para a URL destino que foi encurtada.',
    })
    @ApiTags('Redirect')
    @Get(':shortenedUrl')
    @Redirect('', 301)
    async redirectToOriginalUrl(@Param('shortenedUrl') shortenedUrl: string,@Res() res: Response) {
        const originalUrl = await this.redirectService.redirectToOriginalUrl(shortenedUrl);
        res.setHeader('Cache-Control', 'no-store');
        return { url: `${originalUrl}` };
    }


}
