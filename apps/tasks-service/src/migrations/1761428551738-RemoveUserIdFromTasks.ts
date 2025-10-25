import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserIdFromTasks1761428551738 implements MigrationInterface {
    name = 'RemoveUserIdFromTasks1761428551738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_by_user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "created_by_user_id" uuid NOT NULL`);
    }

}
