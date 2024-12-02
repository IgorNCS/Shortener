import { Expose } from "class-transformer";

export class ResponseShortenerDto {
    
    @Expose({ name: 'originalURL' })
    originalURL:string;

    @Expose({ name: 'shortenerURL' })
    shortenerURL:string;

    @Expose({ name: 'id' })
    identificador:number;
}
