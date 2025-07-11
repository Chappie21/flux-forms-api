import { AuthService } from './../auth.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from 'passport-jwt';
import { CreateUserDto } from '../../user/dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy)  {

    constructor(
        configService: ConfigService,
        private readonly AuthService: AuthService
    ) {
        super({
            clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifiedCallback) {
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;

        const user = await this.AuthService.validateGoogleUser({
            email,
            firstName,
            lastName,
            password: '',
        } as CreateUserDto);

        done(null, user);
    }

}