import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
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

    const user = await this.userModel.findOne({ email }).exec();

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

  async findAll<UserDTO>(userDTO: UserDTO): Promise<UserDTO[]> {
    const users = await this.userModel.find().exec();

    return users.map((user) => plainToClass(userDTO as any, user));
  }

  async findOne<UserDTO>(
    conditions: FilterQuery<User>,
    userDTO?: UserDTO,
  ): Promise<UserDocument | UserDTO> {
    const user = await this.userModel.findOne(conditions).exec();

    if (!user) {
      throw new NotFoundException();
    }

    if (userDTO) {
      return plainToClass(userDTO as any, user);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    await this.findOne({ _id: id });

    const { email } = updateUserDto;

    const emailExists = await this.userModel
      .findOne({ email, _id: { $ne: id } })
      .exec();

    if (emailExists) {
      throw new ConflictException(undefined, 'This email already exists');
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
