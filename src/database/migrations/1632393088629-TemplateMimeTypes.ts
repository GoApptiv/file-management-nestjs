import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TemplateMimeTypes1632393088629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'template_mime_types',
        columns: [
          {
            name: 'templates_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'mime_types_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('template_mime_types', [
      new TableForeignKey({
        columnNames: ['templates_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'templates',
      }),
      new TableForeignKey({
        columnNames: ['mime_types_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mime_types',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('template_mime_types');
    const templatesIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('templates_id') !== -1,
    );
    const mimeTypeIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('mime_types_id') !== -1,
    );

    await queryRunner.dropForeignKey(
      'template_mime_types',
      templatesIdforeignKey,
    );

    await queryRunner.dropForeignKey(
      'template_mime_types',
      mimeTypeIdforeignKey,
    );

    await queryRunner.dropTable('template_mime_types');
  }
}
