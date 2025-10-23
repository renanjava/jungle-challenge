import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoggerModule } from '@my-monorepo/shared-logger';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL,
      serviceName: 'AUTH_SERVICE',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
