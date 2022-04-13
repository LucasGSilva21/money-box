import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj._id.toString(), { toClassOnly: true })
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  @MaxLength(60)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ required: false })
  @Expose()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
