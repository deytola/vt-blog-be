import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateBlogDTO } from '../../DTOs/createblog.dto';
import { Blog, BlogCategory } from '../../entities/blog.entity';
import { User } from '../../../users/entities/user.entity';
import { BLOG_STATUS } from '../../constants/blogs.constants';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBlogDto: CreateBlogDTO): Promise<Blog> {
    const blog = new Blog();
    blog.title = createBlogDto.title;
    blog.content = createBlogDto.content;
    blog.image = createBlogDto.image;
    blog.category = createBlogDto.category ? createBlogDto.category : BlogCategory.GENERAL;
    blog.author = await this.userRepository.findOneBy({
      id: createBlogDto.authorId,
    });
    return await this.blogRepository.save(blog);
  }

  async findAll(
    status: BLOG_STATUS,
    page: number = 1,
    searchQuery?: string,
  ): Promise<{ blogs: Blog[]; totalPages: number }> {
    page = page && page < 1 ? 1 : page;
    const MAX_BLOG_PER_PAGE = 6;
    const limit = MAX_BLOG_PER_PAGE;
    const skip = (page - 1) * limit || 0;

    let queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .where('1=1');

    switch (status) {
      case BLOG_STATUS.LIVE:
        queryBuilder = queryBuilder.andWhere('blog.published_at IS NOT NULL');
        break;
      case BLOG_STATUS.DRAFT:
        queryBuilder = queryBuilder.andWhere('blog.published_at IS NULL');
        break;
      default:
        break;
    }

    if (searchQuery) {
      queryBuilder = queryBuilder.andWhere(
        'LOWER(blog.title) LIKE LOWER(:searchQuery)',
        { searchQuery: `%${searchQuery}%` },
      );
    }

    const totalCount = await queryBuilder.getCount();

    queryBuilder = queryBuilder
      .orderBy('blog.published_at', 'DESC')
      .skip(skip)
      .take(limit);

    const blogs = await queryBuilder.getMany();

    const totalPages = Math.ceil(totalCount / limit);

    return { blogs, totalPages };
  }

  async findOne(slug: string): Promise<{ blog: Blog; relatedBlogs: Blog[] }> {
    const blog: Blog = await this.blogRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const relatedBlogs: Blog[] = await this.blogRepository.find({
      where: { published_at: Not(IsNull()), id: Not(blog.id) },
      order: { published_at: 'DESC' },
      take: 4,
    });

    return { blog, relatedBlogs };
  }

  async remove(slug: string): Promise<void> {
    const blogToDelete: Blog = await this.blogRepository.findOneBy({ slug });
    if (!blogToDelete) {
      throw new NotFoundException('Blog not found');
    }
    await this.blogRepository.softRemove(blogToDelete);
  }

  async update(slug: string, updatePayload: Partial<Blog>): Promise<Blog> {
    const blogToUpdate: Blog = await this.blogRepository.findOneBy({ slug });
    if (!blogToUpdate) {
      throw new NotFoundException('Blog not found');
    }
    delete updatePayload.slug;
    Object.assign(blogToUpdate, updatePayload);
    return await this.blogRepository.save(blogToUpdate);
  }
}
