import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh-token'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET_REFRESH'),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!user) throw new  UnauthorizedException('User does not exist or is not active');

    return user;
  }
}
