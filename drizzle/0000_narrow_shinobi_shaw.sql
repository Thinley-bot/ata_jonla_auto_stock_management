CREATE TABLE IF NOT EXISTS "car_brand" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"brand_name" varchar(255) NOT NULL,
	"brand_desc" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "part_catalogue" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"part_name" varchar(255) NOT NULL,
	"part_number" varchar(255) NOT NULL,
	"category_id" varchar NOT NULL,
	"brand_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "part_category" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"category_desc" varchar(255) NOT NULL,
	"unit" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_sale" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"payment_mode" varchar(50),
	"total_sale" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_sale_detail" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"sale_id" varchar,
	"part_id" varchar,
	"quantity" integer NOT NULL,
	"sub_total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"total_cost" numeric(10, 2) NOT NULL,
	"part_id" varchar(255) NOT NULL,
	"supplier_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplier" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"supplier_name" varchar(255) NOT NULL,
	"supplier_number" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "unit_price" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"part_id" varchar,
	"unit_price" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"role_name" varchar(255) NOT NULL,
	"role_description" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"image" varchar(255),
	"roleId" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "part_catalogue" ADD CONSTRAINT "part_catalogue_category_id_part_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."part_category"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "part_catalogue" ADD CONSTRAINT "part_catalogue_brand_id_car_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."car_brand"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_sale_detail" ADD CONSTRAINT "stock_sale_detail_sale_id_stock_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."stock_sale"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_sale_detail" ADD CONSTRAINT "stock_sale_detail_part_id_part_catalogue_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."part_catalogue"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock" ADD CONSTRAINT "stock_part_id_part_catalogue_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."part_catalogue"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock" ADD CONSTRAINT "stock_supplier_id_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."supplier"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit_price" ADD CONSTRAINT "unit_price_part_id_part_catalogue_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."part_catalogue"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_roleId_user_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."user_role"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
