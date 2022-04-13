import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { name, email, password } = createUserDto;

    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      throw new ConflictException('This email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return this.userModel.create({
      name,
      email,
      password: hashPassword,
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(conditions: FilterQuery<User>): Promise<UserDocument | null> {
    return this.userModel.findOne(conditions).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    await this.findOne({ _id: id });

    const { email } = updateUserDto;

    const emailExists = await this.userModel
      .findOne({ email, _id: { $ne: id } })
      .exec();

    if (emailExists) {
      throw new ConflictException('This email already exists');
    }

    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();

    return this.findOne({ _id: id });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.findOne({ _id: id });

    await this.userModel.updateOne({ _id: id }, { password }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findOneAndRemove({ _id: id }).exec();
  }
}
