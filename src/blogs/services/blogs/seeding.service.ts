import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogCategory } from '../../entities/blog.entity';
import { User } from '../../../users/entities/user.entity';
import { NUMBER_OF_BLOGS_TO_SEED } from '../../constants/blogs.constants';

@Injectable()
export class SeedingService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedBlogs() {
    const authorIds: User[] = await this.seedUsers();
    for (let i = 0; i < NUMBER_OF_BLOGS_TO_SEED; i++) {
      const blogToSeed: Blog = new Blog();
      Object.assign(blogToSeed, {
        title: faker.lorem.words(3),
        content: faker.lorem.sentences(10),
        image: faker.image.urlLoremFlickr({
          width: 1000,
          height: 500,
          category: 'place',
        }),
        published_at: new Date().toISOString(),
        author: this.randomise(authorIds),
        category: this.randomise(Object.values(BlogCategory)),
      });
      await this.blogRepository.save(blogToSeed);
    }
  }

  async seedUsers() {
    const ids = [];
    for (let i = 0; i < 5; i++) {
      const userToSeed: User = new User();
      Object.assign(userToSeed, {
        id: i + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      const savedUser: User = await this.userRepository.save(userToSeed);
      ids.push(savedUser.id);
    }
    return ids;
  }

  randomise = (options: any[]): string[] => {
    const randomIndex: number = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };
}
