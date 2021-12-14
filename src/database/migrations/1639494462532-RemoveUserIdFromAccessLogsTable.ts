import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserIdFromAccessLogsTable1639494462532
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE access_logs DROP COLUMN user_id`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE access_logs ADD user_id int NOT NULL`);
  }
}
