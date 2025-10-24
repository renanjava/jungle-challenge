import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1761287897219 implements MigrationInterface {
  name = 'CreateTasksTable1761287897219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."taskAudit_action_enum" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'STATUS_CHANGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "taskAudit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "task_id" uuid NOT NULL, "action" "public"."taskAudit_action_enum" NOT NULL, "old_value" jsonb, "new_value" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_81a32f5edffb8175fdde8ee166e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "task_id" uuid NOT NULL, "text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by_user_id" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "deadline" TIMESTAMP NOT NULL, "priority" "public"."tasks_priority_enum" NOT NULL, "status" "public"."tasks_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "taskAssignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "task_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_304a4e03362a9b330b8390f0288" UNIQUE ("task_id", "user_id"), CONSTRAINT "PK_a106fad3e0194a7332b8caa68cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "taskAudit" ADD CONSTRAINT "FK_bbd19263582fbebb2edfc5f2adb" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_91256732111f039be6b212d96cd" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "taskAssignment" ADD CONSTRAINT "FK_de9716117986f760336104cf936" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "taskAssignment" DROP CONSTRAINT "FK_de9716117986f760336104cf936"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_91256732111f039be6b212d96cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "taskAudit" DROP CONSTRAINT "FK_bbd19263582fbebb2edfc5f2adb"`,
    );
    await queryRunner.query(`DROP TABLE "taskAssignment"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "taskAudit"`);
    await queryRunner.query(`DROP TYPE "public"."taskAudit_action_enum"`);
  }
}
