import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot({}),
    DatabaseModule,
    UsersModule,
    BlogsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
