import { sql } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const movie = pgTable("movie", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  release: date("release"),
  rating: numeric("rating"),
  poster: text("poster"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  last_login: timestamp("last_login"),
  created: timestamp("created").defaultNow(),
  modified: timestamp("modified")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const favorite = pgTable(
  "favorite",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => user.id)
      .notNull(),
    movieId: integer("movie_id")
      .references(() => movie.id)
      .notNull(),
    created: timestamp("created").defaultNow(),
  },
  (table) => [uniqueIndex("user_movie_unique").on(table.userId, table.movieId)],
);

export type MovieInput = typeof movie.$inferInsert;
export type Movie = typeof movie.$inferSelect;
