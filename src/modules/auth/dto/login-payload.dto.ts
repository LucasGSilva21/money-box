import { ApiProperty } from '@nestjs/swagger';
import { FindUserDto } from '../../users/dto';

export class LoginPayloadDto {
  @ApiProperty({ type: FindUserDto })
  user: FindUserDto;

  @ApiProperty()
  access_token: string;
}
