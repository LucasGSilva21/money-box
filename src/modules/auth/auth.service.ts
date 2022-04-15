import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptographyHelper } from '../../common/helpers/cryptography.helper';
import { UsersService } from '../users/users.service';
import { LoginDto, UpdatePasswordDto, LoginPayloadDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptographyHelper: CryptographyHelper,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginPayloadDto> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });

    if (
      !(await this.cryptographyHelper.compare(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException();
    }

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

    if (
      !(await this.cryptographyHelper.compare(
        updatePasswordDto.oldPassword,
        password,
      ))
    ) {
      throw new UnauthorizedException();
    }

    await this.usersService.updatePassword(id, updatePasswordDto.newPassword);
  }
}
