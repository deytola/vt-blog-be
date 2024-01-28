import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateBlog1706414021364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'blog',
      'author',
      new TableColumn({
        name: 'author',
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'blog',
      'author',
      new TableColumn({
        name: 'author',
        type: 'int',
        isNullable: false,
      }),
    );
  }
}
