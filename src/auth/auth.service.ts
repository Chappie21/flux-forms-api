import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto';
import { User } from '@prisma/client';

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
      user: this.formattedUserDataResponse(user),
      token,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    const token = this.jwtService.sign({
      id: newUser.id,
      email: newUser.email,
    });

    return {
      user: this.formattedUserDataResponse(newUser),
      token,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto): Promise<User> {
    const user = await this.userService.findUserByEmail(googleUser.email);
    if (user) return user;

    const newUser = await this.userService.createUser({
      ...googleUser,
      password: '',
    });

    return newUser;
  }

  private formattedUserDataResponse(user: User) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      region: user.region,
    };
  }
}
