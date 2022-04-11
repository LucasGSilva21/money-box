import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../common/helpers/mongoose-test-module';

describe('AuthController', () => {
  let controller: AuthController;

  class JwtServiceFake {
    public sign(): string {
      return 'any_token';
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        { provide: JwtService, useClass: JwtServiceFake },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
