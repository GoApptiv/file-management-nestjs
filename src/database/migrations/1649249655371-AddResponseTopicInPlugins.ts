import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponseTopicInPlugins1649249655371
  implements MigrationInterface
{
  name = 'AddResponseTopicInPlugins1649249655371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\` ON \`file_management_staging\`.\`files\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management_staging\`.\`plugins\` ADD \`cloud_function_response_topic\` varchar(255) NOT NULL AFTER cloud_function_topic`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management_staging\`.\`files\` ADD UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` (\`uuid\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_management_staging\`.\`files\` DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management_staging\`.\`plugins\` DROP COLUMN \`cloud_function_response_topic\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` ON \`file_management_staging\`.\`files\` (\`uuid\`)`,
    );
  }
}
