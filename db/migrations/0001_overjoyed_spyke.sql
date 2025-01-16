ALTER TABLE "favorites" RENAME TO "favorite";--> statement-breakpoint
ALTER TABLE "favorite" DROP CONSTRAINT "favorites_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "favorite" DROP CONSTRAINT "favorites_movie_id_movie_id_fk";
--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_movie_id_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE no action ON UPDATE no action;