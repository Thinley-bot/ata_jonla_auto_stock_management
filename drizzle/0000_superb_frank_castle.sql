CREATE TABLE "tbl_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_car_brand" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"brand_name" varchar(255) NOT NULL,
	"brand_desc" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_part_catalogue" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"part_name" varchar(255) NOT NULL,
	"part_number" varchar(255) NOT NULL,
	"category_id" varchar NOT NULL,
	"brand_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_part_category" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"category_desc" varchar(255) NOT NULL,
	"unit" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_stock_sale" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"payment_mode" varchar(50),
	"total_sale" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_stock_sale_detail" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"sale_id" varchar,
	"part_id" varchar,
	"quantity" integer NOT NULL,
	"sub_total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "tbl_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "tbl_stock" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"total_cost" numeric(10, 2) NOT NULL,
	"part_id" varchar(255) NOT NULL,
	"supplier_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_supplier" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"supplier_name" varchar(255) NOT NULL,
	"supplier_number" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_unit_price" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"part_id" varchar,
	"unit_price" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_user_role" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"role_name" varchar(255) NOT NULL,
	"role_description" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"username" text,
	"password" varchar,
	"email" varchar NOT NULL,
	"email_verified" boolean,
	"image" text,
	"roleId" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "tbl_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "tbl_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tbl_account" ADD CONSTRAINT "tbl_account_user_id_tbl_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_part_catalogue" ADD CONSTRAINT "tbl_part_catalogue_category_id_tbl_part_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tbl_part_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_part_catalogue" ADD CONSTRAINT "tbl_part_catalogue_brand_id_tbl_car_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."tbl_car_brand"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_sale_detail" ADD CONSTRAINT "tbl_stock_sale_detail_sale_id_tbl_stock_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."tbl_stock_sale"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock_sale_detail" ADD CONSTRAINT "tbl_stock_sale_detail_part_id_tbl_part_catalogue_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."tbl_part_catalogue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_session" ADD CONSTRAINT "tbl_session_user_id_tbl_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock" ADD CONSTRAINT "tbl_stock_part_id_tbl_part_catalogue_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."tbl_part_catalogue"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_stock" ADD CONSTRAINT "tbl_stock_supplier_id_tbl_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."tbl_supplier"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_unit_price" ADD CONSTRAINT "tbl_unit_price_part_id_tbl_part_catalogue_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."tbl_part_catalogue"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_roleId_tbl_user_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."tbl_user_role"("id") ON DELETE set null ON UPDATE set null;