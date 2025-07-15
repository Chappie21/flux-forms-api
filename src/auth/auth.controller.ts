import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { GoogleAuthGuard, JwtRefreshGuard } from './guards';
import { User } from '@prisma/client';
import { CreateUserDto } from '../user/dto';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() siginData: LoginDto) {
    return this.authService.authenticateUser(siginData);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Express.Request) {
    const user = req.user as User;

    return await this.authService.authenticateUser({
      email: user.email,
      password: ''
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  async refresh(
    @GetUser() user: User,
    @Headers() headers: Headers
  ) {
    return this.authService.rotateTokens(user, headers['refresh-token'] as string);
  }

}
