import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) {}

  async authenticateUser({ email, password }: LoginDto) {
    const user = await this.userService.findUserByEmail(email);
    const isPasswordValid = user ? compareSync(password, user.password) : false;

    if (!user || !isPasswordValid) throw new BadRequestException('Invalid email or password.');


    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        region: user.region,
      },
      token,
    };
  }
}
