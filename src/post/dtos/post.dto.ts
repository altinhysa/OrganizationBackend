import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';

export class PostDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  authorId?: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;

  static async fromEntity(entity: Post): Promise<PostDto> {
    return {
      id: entity.id,
      authorId: entity.authorId,
      title: entity.title,
      description: entity.description,
    };
  }
}
