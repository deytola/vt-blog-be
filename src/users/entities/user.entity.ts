import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from '../../blogs/entities/blog.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({
    type: 'varchar',
  })
  firstName: string;

  @Column({
    type: 'varchar',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  lastLoginDate: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'varchar',
  })
  password: string;

  @OneToMany(() => Blog, (blog) => blog.author, {
    nullable: true,
    eager: false,
  })
  blogs: Blog[];
}
