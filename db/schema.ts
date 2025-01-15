import { sql } from "drizzle-orm";
import { date, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const movies = pgTable("movie", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  release: date("release"),
  rating: numeric("rating"),
  poster: text("poster"),
  created: timestamp("created").defaultNow().notNull(),
  modified: timestamp("modified")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
