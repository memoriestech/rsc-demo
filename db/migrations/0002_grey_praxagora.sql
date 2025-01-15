ALTER TABLE "movie" ADD COLUMN "created" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "movie" ADD COLUMN "modified" timestamp DEFAULT now() NOT NULL;