import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { UserCreate } from './dtos/userCreate.dto';
import { UserUpdate } from './dtos/userUpdate.dto';
import { Role } from '.prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<UserDto[]> {
    return await this.prismaService.user.findMany();
  }

  async getById(id: number): Promise<UserDto> {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserDto.fromEntityWithPosts(foundUser);
  }

  async add(user: UserCreate) {
    const addedUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        name: user.name,
        role: Role.USER,
      },
    });
    return UserDto.fromEntity(addedUser);
  }

  async removeById(id: number) {
    await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }

  async update(user: UserUpdate, id: number) {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        email: user.email,
        name: user.name,
      },
    });
    return UserDto.fromEntity(updatedUser);
  }
}
