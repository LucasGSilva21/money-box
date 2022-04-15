import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../users.service';
import { User, UserSchema } from '../schemas/user.schema';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../common/helpers/mongoose-test-module';
import { CryptographyHelper } from '../../../common/helpers/cryptography.helper';

describe('UsersService', () => {
  let service: UsersService;

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
      providers: [
        UsersService,
        { provide: CryptographyHelper, useClass: CryptographyHelperFake },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
