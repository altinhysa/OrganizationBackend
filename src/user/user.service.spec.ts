import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PostModule } from 'src/post/post.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserDto } from './dtos/user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user with id 4', async () => {
    const users: UserDto = await service.getById(4);
    expect(users.id).toBe(4);
  });

  it('should return role USER', async () => {
    const user: UserDto = await service.getById(5);
    expect(user.role).toBe('USER');
  });

  it('should return length 4', async () => {
    const users = await service.getAll();
    expect(users).toHaveLength(4);
  });
});
