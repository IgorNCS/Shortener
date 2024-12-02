import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthVerifyHeaderGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService, 
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request) || this.getCookie(request);

        if (!accessToken) {
            return true;  // Permite acesso sem token, se necessário
        }

        try {
            const payload = await this.jwtService.verifyAsync(accessToken, { secret: process.env.SECRET_KEY_JWT });

            const user = await this.userRepository.findOne({ where: { id: payload.id } });

            if (!user) {
                throw new UnauthorizedException("Access not authorized");
            }

            const { password, ...rest } = user;
            request['user'] = rest;
        } catch (err) {
            throw new UnauthorizedException("Access not authorized");
        }
        return true;
    }

    private extractTokenFromHeader(req: Request) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return undefined;

        const [type, token] = authHeader.split(" ");
        if (type === "Bearer" && token) {
            return token;
        }
        return undefined;
    }

    private getCookie(req: Request) {
        const cookie = req.cookies ? req.cookies.access_token : undefined;
        return cookie;
    }
}
