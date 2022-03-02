import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeysAndIndex1646220784353 implements MigrationInterface {
  name = 'AddForeignKeysAndIndex1646220784353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`template_mime_types\` DROP FOREIGN KEY \`FK_a079a1264b1d08be6bc0637b62c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`templates\` DROP FOREIGN KEY \`FK_a5e19ef9fefab4d6c74b2a40002\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`templates\` CHANGE \`bucket_config_id\` \`bucket_config_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`files\` ADD UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_a079a1264b1d08be6bc0637b62\` ON \`file-management\`.\`template_mime_types\` (\`templates_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_2e6edfbf0a63a9707b8ca882ab\` ON \`file-management\`.\`template_mime_types\` (\`mime_types_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`templates\` ADD CONSTRAINT \`FK_a5e19ef9fefab4d6c74b2a40002\` FOREIGN KEY (\`bucket_config_id\`) REFERENCES \`file-management\`.\`bucket_configs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`template_mime_types\` ADD CONSTRAINT \`FK_a079a1264b1d08be6bc0637b62c\` FOREIGN KEY (\`templates_id\`) REFERENCES \`file-management\`.\`templates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`template_mime_types\` DROP FOREIGN KEY \`FK_a079a1264b1d08be6bc0637b62c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`templates\` DROP FOREIGN KEY \`FK_a5e19ef9fefab4d6c74b2a40002\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2e6edfbf0a63a9707b8ca882ab\` ON \`file-management\`.\`template_mime_types\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a079a1264b1d08be6bc0637b62\` ON \`file-management\`.\`template_mime_types\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`files\` DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`templates\` CHANGE \`bucket_config_id\` \`bucket_config_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`templates\` ADD CONSTRAINT \`FK_a5e19ef9fefab4d6c74b2a40002\` FOREIGN KEY (\`bucket_config_id\`) REFERENCES \`file-management\`.\`bucket_configs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file-management\`.\`template_mime_types\` ADD CONSTRAINT \`FK_a079a1264b1d08be6bc0637b62c\` FOREIGN KEY (\`templates_id\`) REFERENCES \`file-management\`.\`templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
