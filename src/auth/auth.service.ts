import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async authenticateUser({ email, password }: LoginDto) {
    const user = await this.userService.findUserByEmail(email);
    const isPasswordValid = user ? compareSync(password, user.password) : false;

    if (!user || !isPasswordValid)
      throw new BadRequestException('Invalid email or password.');

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.formattedUserDataResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    const { accessToken, refreshToken } = await this.generateTokens(newUser);

    return {
      user: this.formattedUserDataResponse(newUser),
      accessToken,
      refreshToken,
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

  private async generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME_REFRESH'),
    });

    // Store the refresh token in the database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiredAt: new Date(this.jwtService.decode(refreshToken)['exp'] * 1000),
        userId: user.id,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async rotateTokens(user: User, oldRefreshToken: string) {
    const storedOldRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken, isRevoked: false, userId: user.id }
    });

    console.log('Stored Old Refresh Token ID:', storedOldRefreshToken?.id, 'Masked Token:', storedOldRefreshToken?.token?.slice(0, 5) + '...');

    if (!storedOldRefreshToken || storedOldRefreshToken.expiredAt < new Date()) throw new BadRequestException('Invalid or expired refresh token.');

    await this.prisma.refreshToken.update({
      where: { id: storedOldRefreshToken.id },
      data: { isRevoked: true },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
