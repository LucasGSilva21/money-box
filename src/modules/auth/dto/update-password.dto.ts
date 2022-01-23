import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @IsNotEmpty()
  newPassword: string;
}
