import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByColumnInFileVariants1668693727308
  implements MigrationInterface
{
  name = 'AddCreatedByColumnInFileVariants1668693727308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` ADD \`created_by\` int NOT NULL AFTER \`status\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` DROP COLUMN \`created_by\``,
    );
  }
}
