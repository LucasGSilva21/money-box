import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, FindUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<FindUserDto> {
    const { name, email, password } = createUserDto;

    const user = await this.findByEmail(email);

    if (user) {
      throw new ConflictException(undefined, 'This email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
    });

    return plainToClass(FindUserDto, createdUser);
  }

  async findAll(): Promise<FindUserDto[]> {
    const users = await this.userModel.find().exec();

    return users.map((user) => plainToClass(FindUserDto, user));
  }

  async findOne(id: string): Promise<FindUserDto> {
    const user = await this.userModel.findById(id).exec();

    return plainToClass(FindUserDto, user);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
