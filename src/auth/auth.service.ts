import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/request/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}


  async login(loginDto:LoginDto) {
    try {
      
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { userId: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  } catch (error) {
    throw error
  }
  }

  async logout(oi:any){
    return true
  }
}
