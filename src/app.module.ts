import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { configLoader, schemaConfig } from './common/config'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      load: [configLoader],
      validationSchema: schemaConfig
    }),
    UserModule,
    AuthModule,
  ]
})
export class AppModule {}
