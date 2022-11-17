import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialStructure1668668777575 implements MigrationInterface {
  name = 'InitialStructure1668668777575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bucket_configs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`key\` longtext NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`plugins\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`cloud_function_topic\` varchar(255) NOT NULL, \`cloud_function_response_topic\` varchar(255) NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_3474293088c220d37e897a184b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d95a87318392465ab663a32cc4\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`templates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`base_storage_path\` varchar(255) NOT NULL, \`project_id\` int NOT NULL, \`min_size_in_b\` int UNSIGNED NULL, \`max_size_in_b\` int UNSIGNED NULL, \`link_expiry_time_in_s\` int UNSIGNED NOT NULL, \`archive_after_in_d\` int NULL DEFAULT '30', \`bucket_config_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mime_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`extension\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`files\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`reference_number\` varchar(255) NOT NULL, \`template_id\` int NOT NULL, \`status\` enum ('requested', 'uploaded', 'processed', 'deleted') NOT NULL DEFAULT 'requested', \`storage_path\` varchar(255) NOT NULL, \`is_uploaded\` tinyint NOT NULL, \`is_archived\` tinyint NOT NULL, \`file_size\` int UNSIGNED NOT NULL, \`mime_type_id\` int NOT NULL, \`project_id\` int NOT NULL, \`archival_date\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_866212928289ec1112edd04ebf\` (\`status\`), INDEX \`IDX_253736c98c05969627dcd55d83\` (\`is_archived\`), INDEX \`IDX_b3c17c323fdc479a109e517f13\` (\`project_id\`), UNIQUE INDEX \`IDX_80216965527c9be0babd7ea5bb\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file_variants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`file_id\` int NOT NULL, \`plugin_id\` int NOT NULL, \`storage_path\` varchar(255) NULL, \`status\` enum ('requested', 'queued', 'created', 'deleted', 'error') NOT NULL DEFAULT 'requested', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_b596613079738f37c06d4c9f15\` (\`file_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file_variant_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`variant_id\` int NOT NULL, \`plugin_id\` int NOT NULL, \`status\` enum ('requested', 'queued', 'created', 'deleted', 'error') NOT NULL DEFAULT 'requested', \`message_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`project_plugins\` (\`project_id\` int NOT NULL, \`plugin_id\` int NOT NULL, \`webhook_url\` longtext NULL, \`pubsub_status_subscriber\` varchar(255) NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`project_id\`, \`plugin_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`access_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`file_id\` int NOT NULL, \`project_id\` int NOT NULL, \`ip\` varchar(255) NOT NULL, \`user_agent\` varchar(255) NOT NULL, \`is_archived\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_60eb2d868419b7a0b6a4b23e3f\` (\`file_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`template_mime_types\` (\`templates_id\` int NOT NULL, \`mime_types_id\` int NOT NULL, INDEX \`IDX_a079a1264b1d08be6bc0637b62\` (\`templates_id\`), INDEX \`IDX_2e6edfbf0a63a9707b8ca882ab\` (\`mime_types_id\`), PRIMARY KEY (\`templates_id\`, \`mime_types_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`templates\` ADD CONSTRAINT \`FK_54e5c9fc0c740b2bd65f0160b5a\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`templates\` ADD CONSTRAINT \`FK_a5e19ef9fefab4d6c74b2a40002\` FOREIGN KEY (\`bucket_config_id\`) REFERENCES \`bucket_configs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD CONSTRAINT \`FK_09adf237cc31969e3ffb0cd5d01\` FOREIGN KEY (\`template_id\`) REFERENCES \`templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD CONSTRAINT \`FK_97ecb74c9dd2f6b8ea4c38bd1b0\` FOREIGN KEY (\`mime_type_id\`) REFERENCES \`mime_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` ADD CONSTRAINT \`FK_b3c17c323fdc479a109e517f138\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` ADD CONSTRAINT \`FK_b596613079738f37c06d4c9f158\` FOREIGN KEY (\`file_id\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` ADD CONSTRAINT \`FK_9f7ad774e3b5d845f47e8e68996\` FOREIGN KEY (\`plugin_id\`) REFERENCES \`plugins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variant_logs\` ADD CONSTRAINT \`FK_f5f0e4b2bfd8c07b3b841ccecf2\` FOREIGN KEY (\`variant_id\`) REFERENCES \`file_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variant_logs\` ADD CONSTRAINT \`FK_0f2328c15466a1d0111c73efaba\` FOREIGN KEY (\`plugin_id\`) REFERENCES \`plugins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_plugins\` ADD CONSTRAINT \`FK_0712b8d278f3538d290f4358445\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_plugins\` ADD CONSTRAINT \`FK_9c4363beac68de1f2005cbd97e0\` FOREIGN KEY (\`plugin_id\`) REFERENCES \`plugins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`template_mime_types\` ADD CONSTRAINT \`FK_a079a1264b1d08be6bc0637b62c\` FOREIGN KEY (\`templates_id\`) REFERENCES \`templates\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`template_mime_types\` ADD CONSTRAINT \`FK_2e6edfbf0a63a9707b8ca882abb\` FOREIGN KEY (\`mime_types_id\`) REFERENCES \`mime_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`template_mime_types\` DROP FOREIGN KEY \`FK_2e6edfbf0a63a9707b8ca882abb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`template_mime_types\` DROP FOREIGN KEY \`FK_a079a1264b1d08be6bc0637b62c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_plugins\` DROP FOREIGN KEY \`FK_9c4363beac68de1f2005cbd97e0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`project_plugins\` DROP FOREIGN KEY \`FK_0712b8d278f3538d290f4358445\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variant_logs\` DROP FOREIGN KEY \`FK_0f2328c15466a1d0111c73efaba\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variant_logs\` DROP FOREIGN KEY \`FK_f5f0e4b2bfd8c07b3b841ccecf2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` DROP FOREIGN KEY \`FK_9f7ad774e3b5d845f47e8e68996\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file_variants\` DROP FOREIGN KEY \`FK_b596613079738f37c06d4c9f158\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_b3c17c323fdc479a109e517f138\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_97ecb74c9dd2f6b8ea4c38bd1b0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_09adf237cc31969e3ffb0cd5d01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`templates\` DROP FOREIGN KEY \`FK_a5e19ef9fefab4d6c74b2a40002\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`templates\` DROP FOREIGN KEY \`FK_54e5c9fc0c740b2bd65f0160b5a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_2e6edfbf0a63a9707b8ca882ab\` ON \`template_mime_types\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a079a1264b1d08be6bc0637b62\` ON \`template_mime_types\``,
    );
    await queryRunner.query(`DROP TABLE \`template_mime_types\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_60eb2d868419b7a0b6a4b23e3f\` ON \`access_logs\``,
    );
    await queryRunner.query(`DROP TABLE \`access_logs\``);
    await queryRunner.query(`DROP TABLE \`project_plugins\``);
    await queryRunner.query(`DROP TABLE \`file_variant_logs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b596613079738f37c06d4c9f15\` ON \`file_variants\``,
    );
    await queryRunner.query(`DROP TABLE \`file_variants\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_80216965527c9be0babd7ea5bb\` ON \`files\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b3c17c323fdc479a109e517f13\` ON \`files\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_253736c98c05969627dcd55d83\` ON \`files\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_866212928289ec1112edd04ebf\` ON \`files\``,
    );
    await queryRunner.query(`DROP TABLE \`files\``);
    await queryRunner.query(`DROP TABLE \`mime_types\``);
    await queryRunner.query(`DROP TABLE \`templates\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d95a87318392465ab663a32cc4\` ON \`projects\``,
    );
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3474293088c220d37e897a184b\` ON \`plugins\``,
    );
    await queryRunner.query(`DROP TABLE \`plugins\``);
    await queryRunner.query(`DROP TABLE \`bucket_configs\``);
  }
}
