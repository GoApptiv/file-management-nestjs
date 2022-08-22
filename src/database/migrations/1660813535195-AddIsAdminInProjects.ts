import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAdminInProjects1660813535195 implements MigrationInterface {
  name = 'AddIsAdminInProjects1660813535195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\` ON \`file_management\`.\`files\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`projects\` ADD \`is_admin\` tinyint NOT NULL DEFAULT 0 AFTER \`code\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`files\` ADD UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` (\`uuid\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`files\` DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`projects\` DROP COLUMN \`is_admin\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` ON \`file_management\`.\`files\` (\`uuid\`)`,
    );
  }
}
