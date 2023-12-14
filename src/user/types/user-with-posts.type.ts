import { Prisma } from '@prisma/client';
export type UserWithPosts = Prisma.UserGetPayload<{
  include: {
    posts: true;
  };
}>;
