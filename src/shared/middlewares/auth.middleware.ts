import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Use basic auth');
    }
    const basicAuth = req.headers.authorization.split(' ')[1];
    const id = Buffer.from(basicAuth, 'base64').toString().split(':')[0];

    try {
      const user = await this.userService.getById(+id);
      req.user = user;
    } catch (err) {
      console.log(err.message);
    }

    next();
  }
}
