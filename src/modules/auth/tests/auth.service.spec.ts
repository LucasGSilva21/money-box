import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { User, UserSchema } from '../../users/schemas/user.schema';
import { UsersService } from '../../users/users.service';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../common/helpers/mongoose-test-module';
import { CryptographyHelper } from '../../../common/helpers/cryptography.helper';

describe('AuthService', () => {
  let service: AuthService;

  class JwtServiceFake {
    public sign(): string {
      return 'any_token';
    }
  }

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
        AuthService,
        UsersService,
        { provide: JwtService, useClass: JwtServiceFake },
        { provide: CryptographyHelper, useClass: CryptographyHelperFake },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
