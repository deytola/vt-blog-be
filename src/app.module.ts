import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BlogsModule } from './blogs/blogs.module';
import { SeedingService } from './blogs/services/blogs/seeding.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/entities/blog.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot({}),
    DatabaseModule,
    UsersModule,
    BlogsModule,
    TypeOrmModule.forFeature([Blog, User]),
  ],
  controllers: [],
  providers: [SeedingService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      await this.seedingService.seedBlogs();
      console.log('Blogs seeded successfully.');
    }
  }
}
