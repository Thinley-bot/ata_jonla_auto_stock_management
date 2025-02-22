ALTER TABLE "tbl_user_role" DROP CONSTRAINT "tbl_user_role_created_by_tbl_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tbl_user_role" DROP CONSTRAINT "tbl_user_role_updated_by_tbl_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tbl_user_role" DROP COLUMN "created_by";--> statement-breakpoint
ALTER TABLE "tbl_user_role" DROP COLUMN "updated_by";