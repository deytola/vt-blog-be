import { Module } from '@nestjs/common';
import { BlogsController } from './controllers/blogs/blogs.controller';
import { BlogsService } from './services/blogs/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, User]),
    ConfigModule.forRoot()
  ],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
