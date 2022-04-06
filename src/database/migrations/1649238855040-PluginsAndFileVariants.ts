import { MigrationInterface, QueryRunner } from 'typeorm';

export class PluginsAndFileVariants1649238855040 implements MigrationInterface {
  name = 'PluginsAndFileVariants1649238855040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`template_mime_types\` DROP FOREIGN KEY \`FK_a079a1264b1d08be6bc0637b62c\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`file_management\`.\`plugins\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`cloud_function_topic\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_3474293088c220d37e897a184b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file_management\`.\`file_variants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`file_id\` int NOT NULL, \`plugin_id\` int NOT NULL, \`storage_path\` varchar(255) NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file_management\`.\`file_variant_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`variant_id\` int NOT NULL, \`plugin_id\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`creation_topic_message_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file_management\`.\`project_plugins\` (\`project_id\` int NOT NULL, \`plugin_id\` int NOT NULL, \`webhook_url\` longtext NULL, \`pubsub_status_subscriber\` varchar(255) NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`project_id\`, \`plugin_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`templates\` DROP FOREIGN KEY \`FK_a5e19ef9fefab4d6c74b2a40002\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`templates\` CHANGE \`bucket_config_id\` \`bucket_config_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`files\` ADD UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` (\`uuid\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_a079a1264b1d08be6bc0637b62\` ON \`file_management\`.\`template_mime_types\` (\`templates_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_2e6edfbf0a63a9707b8ca882ab\` ON \`file_management\`.\`template_mime_types\` (\`mime_types_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`templates\` ADD CONSTRAINT \`FK_a5e19ef9fefab4d6c74b2a40002\` FOREIGN KEY (\`bucket_config_id\`) REFERENCES \`file_management\`.\`bucket_configs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variants\` ADD CONSTRAINT \`FK_b596613079738f37c06d4c9f158\` FOREIGN KEY (\`file_id\`) REFERENCES \`file_management\`.\`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variants\` ADD CONSTRAINT \`FK_9f7ad774e3b5d845f47e8e68996\` FOREIGN KEY (\`plugin_id\`) REFERENCES \`file_management\`.\`plugins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variant_logs\` ADD CONSTRAINT \`FK_f5f0e4b2bfd8c07b3b841ccecf2\` FOREIGN KEY (\`variant_id\`) REFERENCES \`file_management\`.\`file_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variant_logs\` ADD CONSTRAINT \`FK_0f2328c15466a1d0111c73efaba\` FOREIGN KEY (\`plugin_id\`) REFERENCES \`file_management\`.\`plugins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`project_plugins\` ADD CONSTRAINT \`FK_0712b8d278f3538d290f4358445\` FOREIGN KEY (\`project_id\`) REFERENCES \`file_management\`.\`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`project_plugins\` ADD CONSTRAINT \`FK_9c4363beac68de1f2005cbd97e0\` FOREIGN KEY (\`plugin_id\`) REFERENCES \`file_management\`.\`plugins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`template_mime_types\` ADD CONSTRAINT \`FK_a079a1264b1d08be6bc0637b62c\` FOREIGN KEY (\`templates_id\`) REFERENCES \`file_management\`.\`templates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`template_mime_types\` DROP FOREIGN KEY \`FK_a079a1264b1d08be6bc0637b62c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`project_plugins\` DROP FOREIGN KEY \`FK_9c4363beac68de1f2005cbd97e0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`project_plugins\` DROP FOREIGN KEY \`FK_0712b8d278f3538d290f4358445\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variant_logs\` DROP FOREIGN KEY \`FK_0f2328c15466a1d0111c73efaba\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variant_logs\` DROP FOREIGN KEY \`FK_f5f0e4b2bfd8c07b3b841ccecf2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variants\` DROP FOREIGN KEY \`FK_9f7ad774e3b5d845f47e8e68996\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`file_variants\` DROP FOREIGN KEY \`FK_b596613079738f37c06d4c9f158\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`templates\` DROP FOREIGN KEY \`FK_a5e19ef9fefab4d6c74b2a40002\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2e6edfbf0a63a9707b8ca882ab\` ON \`file_management\`.\`template_mime_types\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a079a1264b1d08be6bc0637b62\` ON \`file_management\`.\`template_mime_types\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`files\` DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`templates\` CHANGE \`bucket_config_id\` \`bucket_config_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`templates\` ADD CONSTRAINT \`FK_a5e19ef9fefab4d6c74b2a40002\` FOREIGN KEY (\`bucket_config_id\`) REFERENCES \`file_management\`.\`bucket_configs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `DROP TABLE \`file_management\`.\`project_plugins\``,
    );
    await queryRunner.query(
      `DROP TABLE \`file_management\`.\`file_variant_logs\``,
    );
    await queryRunner.query(`DROP TABLE \`file_management\`.\`file_variants\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3474293088c220d37e897a184b\` ON \`file_management\`.\`plugins\``,
    );
    await queryRunner.query(`DROP TABLE \`file_management\`.\`plugins\``);
    await queryRunner.query(
      `ALTER TABLE \`file_management\`.\`template_mime_types\` ADD CONSTRAINT \`FK_a079a1264b1d08be6bc0637b62c\` FOREIGN KEY (\`templates_id\`) REFERENCES \`file_management\`.\`templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
