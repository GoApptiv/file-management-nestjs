import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Files1632393088630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'reference_number',
            type: 'varchar',
          },
          {
            name: 'template_id',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['requested', 'uploaded', 'processed', 'deleted'],
            default: '"requested"',
          },
          {
            name: 'storage_path',
            type: 'varchar',
          },
          {
            name: 'is_uploaded',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'is_archived',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'file_size',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'mime_type_id',
            type: 'int',
          },
          {
            name: 'archival_date',
            type: 'timestamp',
          },
          {
            name: 'project_id',
            type: 'int',
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

    await queryRunner.createForeignKeys('files', [
      new TableForeignKey({
        columnNames: ['template_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'templates',
      }),
      new TableForeignKey({
        columnNames: ['mime_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mime_types',
      }),
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
      }),
    ]);

    await queryRunner.createIndex(
      'files',
      new TableIndex({
        name: 'IDX_UUID',
        columnNames: ['uuid'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('files');

    const templatesIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('template_id') !== -1,
    );
    const mimeTypeIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('mime_type_id') !== -1,
    );
    const projectIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('project_id') !== -1,
    );

    await queryRunner.dropForeignKey('files', templatesIdforeignKey);
    await queryRunner.dropForeignKey('files', mimeTypeIdforeignKey);
    await queryRunner.dropForeignKey('files', projectIdforeignKey);

    await queryRunner.dropIndex('files', 'IDX_UUID');

    await queryRunner.dropTable('files');
  }
}
