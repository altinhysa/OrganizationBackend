import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreate } from './dtos/userCreate.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserUpdate } from './dtos/userUpdate.dto';
import { UserDto } from './dtos/user.dto';
import { User } from 'src/shared/decorators/user.decorator';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBasicAuth()
@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('users')
@ApiUnauthorizedResponse({ description: 'Not authorized' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  getAll() {
    return this.userService.getAll();
  }

  @Get('/:id')
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ type: UserDto })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  add(@Body() user: UserCreate) {
    return this.userService.add(user);
  }

  @Put('/:id')
  @ApiOkResponse({ type: UserDto })
  update(@Body() user: UserUpdate, @Param('id', ParseIntPipe) id: number) {
    return this.userService.update(user, id);
  }

  @Delete()
  @ApiOkResponse()
  deleteById(@User() user: UserDto) {
    this.userService.removeById(user.id);
  }
}
