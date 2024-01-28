// seeding.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../../entities/blog.entity';
import { BLOG_SEEDS } from '../../utils/blogs.utils';

@Injectable()
export class SeedingService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async seedBlogs() {
      for (const blogData of BLOG_SEEDS){
        const blogToSeed = new Blog();
        Object.assign(blogToSeed, blogData)
        await this.blogRepository.save(blogToSeed);
      }
  }
}
