import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../common/helpers/mongoose-test-module';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('Create', () => {
    it('should return an user when send correct values', async () => {
      const user = await controller.create({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      });
      expect(user).toHaveProperty('id');
      expect(user.name).toEqual('valid_name');
      expect(user.email).toEqual('valid_email@mail.com');
    });
  });

  describe('Find All', () => {
    it('should return a void list', async () => {
      const users = await controller.findAll();
      expect(users).toEqual([]);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
