import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, UpdatePasswordDto } from './dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(userMail: string, userPassword: string) {
    try {
      const user = (await this.usersService.findOne({
        email: userMail,
      })) as UserDocument;

      if (!(await bcrypt.compare(userPassword, user.password))) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { email: user.email, sub: user._id };

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { password } = await this.usersService.findOne({ _id: id });

    if (!(await bcrypt.compare(updatePasswordDto.oldPassword, password))) {
      throw new UnauthorizedException();
    }

    await this.usersService.updatePassword(id, updatePasswordDto.newPassword);
  }
}
