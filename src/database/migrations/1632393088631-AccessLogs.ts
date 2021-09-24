import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AccessLogs1632393088631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_logs',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'file_id',
            type: 'bigint',
          },
          {
            name: 'project_id',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'ip',
            type: 'varchar',
          },
          {
            name: 'user_agent',
            type: 'varchar',
          },
          {
            name: 'is_archived',
            type: 'tinyint',
            default: 0,
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

    await queryRunner.createForeignKeys('access_logs', [
      new TableForeignKey({
        columnNames: ['file_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
      }),
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('access_logs');

    const fileIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('template_id') !== -1,
    );
    const projectIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('project_id') !== -1,
    );

    await queryRunner.dropForeignKey('access_logs', fileIdforeignKey);
    await queryRunner.dropForeignKey('access_logs', projectIdforeignKey);

    await queryRunner.dropTable('access_logs');
  }
}
