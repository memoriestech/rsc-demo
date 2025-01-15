import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

export const moviesTable = pgTable("movie", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  release: date("release"),
});
