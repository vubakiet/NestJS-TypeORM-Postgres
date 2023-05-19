import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegister } from './validate-models/user-register.model';
import { UserLogin } from './validate-models/user-login.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegister: UserRegister) {
    return await this.authService.register(userRegister);
  }

  @Post('login')
  async login(@Body() userLogin: UserLogin) {
    return await this.authService.login(userLogin);
  }
}
