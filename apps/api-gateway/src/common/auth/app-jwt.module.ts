import { Module } from '@nestjs/common';
import { AppJwtService } from './app-jwt.service';
import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, JwtModule.register({}), ConfigModule],
  providers: [AppJwtService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AppJwtService],
})
export class AppJwtModule {}
