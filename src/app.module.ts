import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { configLoader, schemaConfig } from './common/config'

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      load: [configLoader],
      validationSchema: schemaConfig
    })
  ],
  providers: [PrismaService],
})
export class AppModule {}
