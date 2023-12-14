import { UserDto } from './../user/dtos/user.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostDto } from './dtos/post.dto';
import { PostCreate } from './dtos/postCreate.dto';
import { PostUpdate } from './dtos/postUpdate.dto';
import { Role } from '.prisma/client';
import { PostResponse } from './dtos/postResponse.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<PostDto[]> {
    return await this.prismaService.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async getById(id: number, user: UserDto): Promise<PostResponse> {
    const foundPost = await this.findById(id);
    return {
      id: foundPost.id,
      author: foundPost.author,
      title: foundPost.title,
      description: foundPost.description,
    };
  }

  async add(post: PostCreate, user: UserDto) {
    const newPost = await this.prismaService.post.create({
      data: {
        authorId: user.id,
        title: post.title,
        description: post.description,
      },
    });
    return PostDto.fromEntity(newPost);
  }

  async updateById(post: PostUpdate, id: number, user: UserDto) {
    const foundPost = await this.findById(id);
    console.log(user);
    if (foundPost.authorId !== user.id) {
      throw new ForbiddenException('Action forbidden');
    }
    const updatedPost = await this.prismaService.post.update({
      where: {
        id: id,
      },
      data: post,
    });
    return PostDto.fromEntity(updatedPost);
  }

  async deleteById(id: number, user: UserDto) {
    const foundPost = await this.findById(id);
    if (foundPost.authorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Action forbidden');
    }
    await this.prismaService.post.delete({
      where: {
        id: id,
      },
    });
  }

  async getAllByUserId(userId: number): Promise<PostDto[]> {
    return await this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  private async findById(id: number) {
    const foundPost = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });
    if (!foundPost) {
      throw new NotFoundException(`Post with id: ${id} not found`);
    }
    return foundPost;
  }
}
