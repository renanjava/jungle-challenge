import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRelationshipInTaskAudit1761517654462 implements MigrationInterface {
    name = 'RemoveRelationshipInTaskAudit1761517654462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskAudit" DROP CONSTRAINT "FK_bbd19263582fbebb2edfc5f2adb"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskAudit" ADD CONSTRAINT "FK_bbd19263582fbebb2edfc5f2adb" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
