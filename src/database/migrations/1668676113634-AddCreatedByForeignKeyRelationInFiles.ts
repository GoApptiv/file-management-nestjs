import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByForeignKeyRelationInFiles1668676113634
  implements MigrationInterface
{
  name = 'AddCreatedByForeignKeyRelationInFiles1668676113634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD CONSTRAINT \`FK_e92953fa5019c241b3f1a7c1520\` FOREIGN KEY (\`created_by\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_e92953fa5019c241b3f1a7c1520\``,
    );
  }
}
