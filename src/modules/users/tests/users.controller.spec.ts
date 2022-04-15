import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User, UserSchema } from '../schemas/user.schema';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../common/helpers/mongoose-test-module';
import { CryptographyHelper } from '../../../common/helpers/cryptography.helper';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  class CryptographyHelperFake {
    public hash(): Promise<string> {
      return new Promise((resolve) => resolve('any_hash'));
    }

    public compare(): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: CryptographyHelper, useClass: CryptographyHelperFake },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  describe('Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('Find All', () => {
    it('should return a list of users', async () => {
      await userService.create({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      });
      await userService.create({
        name: 'other_name',
        email: 'other_email@mail.com',
        password: 'other_password',
      });
      const users = await controller.findAll();
      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('valid_name');
      expect(users[1].name).toBe('other_name');
    });
  });

  describe('Find One', () => {
    it('should return an user', async () => {
      const { id } = await userService.create({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      });
      const user = await controller.findOne(id);
      expect(user).toHaveProperty('id');
      expect(user.name).toEqual('valid_name');
      expect(user.email).toEqual('valid_email@mail.com');
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
