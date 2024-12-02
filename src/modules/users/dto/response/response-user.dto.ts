import { Expose } from "class-transformer";

export class ResponseUserDto {

    @Expose({ name: 'id' })
    identificador: number;

    @Expose({ name: 'email' })
    email: string;

    @Expose({ name: 'name' })
    nome: string;
}
