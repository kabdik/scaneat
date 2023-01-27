import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ServerConfig } from '@/config/server.config';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: ServerConfig.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: `${ServerConfig.JWT_ACCESS_TTL_IN_MINUTES} minutes` },
    })],
  providers: [AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
