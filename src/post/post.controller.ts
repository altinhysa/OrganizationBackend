import { Body, Delete, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from '.prisma/client';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { PostCreate } from './dtos/postCreate.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { UserDto } from 'src/user/dtos/user.dto';
import { PostUpdate } from './dtos/postUpdate.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostDto } from './dtos/post.dto';

@ApiBasicAuth()
@UseGuards(AuthGuard)
@Controller('posts')
@ApiTags('posts')
@ApiUnauthorizedResponse({ description: 'Not authorized' })
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiOkResponse({ type: [PostDto] })
  getAll() {
    return this.postService.getAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id/admin')
  @ApiOkResponse()
  @ApiForbiddenResponse({ description: 'Forbidden action' })
  deletePostByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserDto,
  ) {
    return this.postService.deleteById(id, user);
  }

  @Get('/mine')
  @ApiOkResponse({ type: [PostDto] })
  getAllByUserId(@User() user: UserDto) {
    return this.postService.getAllByUserId(user.id);
  }

  @Get('/:id')
  @ApiOkResponse({ type: PostDto })
  @ApiNotFoundResponse({ description: 'Post with id: not found' })
  getById(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.postService.getById(id, user);
  }

  @Post()
  @ApiCreatedResponse({ type: PostDto })
  add(@Body() post: PostCreate, @User() user: UserDto) {
    return this.postService.add(post, user);
  }

  @Put('/:id')
  @ApiOkResponse({ type: PostDto })
  updateById(
    @Body() post: PostUpdate,
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserDto,
  ) {
    return this.postService.updateById(post, id, user);
  }

  @Delete('/:id')
  deleteById(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    this.postService.deleteById(id, user);
  }
}
