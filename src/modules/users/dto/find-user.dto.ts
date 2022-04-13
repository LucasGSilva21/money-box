import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class FindUserDto {
  @Expose()
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  id: string;

  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsEmail()
  @MaxLength(60)
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
