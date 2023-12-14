import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dtos/user.dto';

export class PostResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  author: UserDto;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
}
