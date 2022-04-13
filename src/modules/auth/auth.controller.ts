import {
  Controller,
  Body,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginPayloadDto } from './dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto, FindUserDto } from '../users/dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { plainToClass } from 'class-transformer';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LoginPayloadDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginPayloadDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: FindUserDto,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);
    return plainToClass(FindUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@AuthUser() user: any): any {
    return user;
  }
}
