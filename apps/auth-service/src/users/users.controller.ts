import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from '@my-monorepo/shared-dtos';
import { UpdateUserDto } from '@my-monorepo/shared-dtos';
import { LoginDto } from '@my-monorepo/shared-dtos';
import { LoggerService } from '@my-monorepo/shared-logger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  create(@Body() registerDto: RegisterDto) {
    this.logger.log("(POST) - Path '/' do UsersController");
    return this.usersService.create(registerDto);
  }

  @Get()
  findAll() {
    this.logger.log("(GET) - Path '/' do UsersController");
    return this.usersService.findAll();
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    this.logger.log("(POST) - Path '/login' do UsersController");
    return this.usersService.login(loginDto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    this.logger.log("(GET) - Path '/:id' do UsersController");
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log("(PATCH) - Path '/:id' do UsersController");
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.logger.log("(Delete) - Path '/:id' do UsersController");
    return this.usersService.remove(id);
  }
}
