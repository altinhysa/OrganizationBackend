import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthMiddleware } from './shared/middlewares/auth.middleware';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [UserModule, PostModule, OrganizationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users', 'posts', 'organizations');
  }
}
