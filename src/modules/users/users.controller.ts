import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, FindUserDto } from './dto';
import { plainToClass } from 'class-transformer';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<FindUserDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => plainToClass(FindUserDto, user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindUserDto> {
    const user = this.usersService.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException();
    }
    return plainToClass(FindUserDto, user);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<FindUserDto> {
    const user = this.usersService.update(id, updateUserDto);
    return plainToClass(FindUserDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    this.usersService.remove(id);
  }
}
