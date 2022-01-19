import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsMongoId,
  IsDate,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindUserDto {
  @Expose()
  @IsMongoId()
  _id: string;

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
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
