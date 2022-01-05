import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Templates1632391928988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'templates',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'base_storage_path',
            type: 'varchar',
          },
          {
            name: 'project_id',
            type: 'int',
          },
          {
            name: 'min_size_in_b',
            type: 'int',
            isNullable: true,
            unsigned: true,
          },
          {
            name: 'max_size_in_b',
            type: 'int',
            isNullable: true,
            unsigned: true,
          },
          {
            name: 'link_expiry_time_in_s',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'archive_after_in_d',
            type: 'int',
            unsigned: true,
            default: 30,
          },
          {
            name: 'bucket_config_id',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'templates',
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
      }),
    );

    await queryRunner.createForeignKey(
      'templates',
      new TableForeignKey({
        columnNames: ['bucket_config_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bucket_configs',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('templates');
    const projectForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('project_id') !== -1,
    );

    const bucketConfigForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('bucket_config_id') !== -1,
    );

    await queryRunner.dropForeignKey('templates', projectForeignKey);
    await queryRunner.dropForeignKey('templates', bucketConfigForeignKey);

    await queryRunner.dropTable('templates');
  }
}
