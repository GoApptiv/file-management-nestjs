import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class RemoveProjectIdFromBucketConfigTable1636908825223
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('bucket_configs');

    const projectIdforeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('project_id') !== -1,
    );

    await queryRunner.dropForeignKey('bucket_configs', projectIdforeignKey);

    await queryRunner.query(
      `ALTER TABLE bucket_configs DROP COLUMN project_id`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE templates ADD project_id int NOT NULL`,
    );

    await queryRunner.createForeignKey(
      'bucket_configs',
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
      }),
    );
  }
}
