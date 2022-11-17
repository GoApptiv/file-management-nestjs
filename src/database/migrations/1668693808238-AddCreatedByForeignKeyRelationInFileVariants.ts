import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByForeignKeyRelationInFileVariants1668693808238
  implements MigrationInterface
{
  name = 'AddCreatedByForeignKeyRelationInFileVariants1668693808238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` ADD CONSTRAINT \`FK_e54117ffea046f84c8aae3f5307\` FOREIGN KEY (\`created_by\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` DROP FOREIGN KEY \`FK_e54117ffea046f84c8aae3f5307\``,
    );
  }
}
