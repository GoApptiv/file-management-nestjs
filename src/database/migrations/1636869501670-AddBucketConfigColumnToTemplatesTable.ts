import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddBucketConfigColumnToTemplatesTable1636869501670
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE templates ADD bucket_config_id int`);

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
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('bucket_config_id') !== -1,
    );

    await queryRunner.dropForeignKey('templates', foreignKey);

    await queryRunner.query(
      `ALTER TABLE templates DROP COLUMN bucket_config_id`,
    );
  }
}
