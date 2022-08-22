import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUuidIndexInFiles1661155226831 implements MigrationInterface {
  name = 'AddUuidIndexInFiles1661155226831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` (\`uuid\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\``,
    );
  }
}
