CREATE TABLE "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"handle" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "models_name_unique" UNIQUE("name"),
	CONSTRAINT "models_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "models" ADD CONSTRAINT "models_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;