import { IsNotEmpty } from 'class-validator';
import { BlogCategory } from '../entities/blog.entity';

export class CreateBlogDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  content: string;

  category?: BlogCategory;

  authorId?: number;
}
