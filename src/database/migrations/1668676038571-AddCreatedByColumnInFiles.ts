import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByColumnInFiles1668676038571
  implements MigrationInterface
{
  name = 'AddCreatedByColumnInFiles1668676038571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD \`created_by\` int NOT NULL  AFTER \`project_id\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_e92953fa5019c241b3f1a7c152\` ON \`files\` (\`created_by\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e92953fa5019c241b3f1a7c152\` ON \`files\``,
    );
    await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`created_by\``);
  }
}
