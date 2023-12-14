import { User } from '@prisma/client';
import { PostDto } from 'src/post/dtos/post.dto';
import { Role } from '.prisma/client';
import { UserWithPosts } from '../types/user-with-posts.type';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ enum: Role })
  role: Role;
  @ApiProperty({ type: [PostDto] })
  posts?: PostDto[];

  static fromEntity(entity: User): UserDto {
    return {
      id: entity.id,
      name: entity.name,
      role: entity.role,
      email: entity.email,
    };
  }

  static fromEntityWithPosts(entity: UserWithPosts): UserDto {
    return {
      id: entity.id,
      name: entity.name,
      role: entity.role,
      email: entity.email,
      posts: entity.posts,
    };
  }
}
