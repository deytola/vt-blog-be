import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  BeforeInsert
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { slugify } from '../utils/blogs.utils';

export enum BlogCategory {
  ADVENTURE = 'Adventure',
  FASHION = 'Fashion',
  TECHNOLOGY = 'Technology',
  GENERAL = 'General',
  TRAVEL = 'Travel',
}
@Entity()
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column()
  title: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  image: string;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: BlogCategory,
    default: BlogCategory.GENERAL
  })
  category: BlogCategory;

  @ManyToOne(() => User, user => user.blogs)
  author: User;

  @Column({
    nullable: true
  })
  published_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.title, this.author.id);
  }
}
