import { Module } from '@nestjs/common';
import { BlogsController } from './controllers/blogs/blogs.controller';

@Module({
  controllers: [BlogsController]
})
export class BlogsModule {}
