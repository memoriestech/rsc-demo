"use server";
import { db } from "@/db";
import { favorite, movie } from "@/db/schema";
import { and, count, eq, ilike, sql } from "drizzle-orm";

type Movie = typeof movie.$inferInsert;

export async function getOrCreateMovie(input: Movie) {
  const existing = await db.select().from(movie).where(eq(movie.tmdbId, input.tmdbId));

  if (existing.length > 0) {
    return existing[0];
  }

  const inserted = await db.insert(movie).values(input).returning();

  return inserted[0];
}

export async function addFavoriteMovie(userId: number, movieId: number) {
  return db.insert(favorite).values({ userId, movieId }).onConflictDoNothing().returning();
}

export async function removeFavoriteMovie(userId: number, movieId: number) {
  return db
    .delete(favorite)
    .where(and(eq(favorite.userId, userId), eq(favorite.movieId, movieId)))
    .returning();
}

export async function getFavoriteMovies(
  userId: number,
  filter?: { page?: number; limit?: number; search?: string },
) {
  const query = db
    .select()
    .from(favorite)
    .innerJoin(movie, eq(favorite.movieId, movie.id))
    .where(
      and(
        eq(favorite.userId, userId),
        filter?.search ? ilike(movie.title, `%${filter.search}%`) : undefined,
      ),
    );

  if (filter?.page && filter.limit) {
    query.offset((filter.page - 1) * filter.limit);
  }

  if (filter?.limit) {
    query.limit(filter.limit);
  }

  const result = await query.orderBy(sql`${movie.release} desc`);

  return result.map((m) => m.movie);
}

export async function countFavoriteMovies(userId: number, filter?: { search?: string }) {
  const result = await db
    .select({ count: count() })
    .from(favorite)
    .innerJoin(movie, eq(favorite.movieId, movie.id))
    .where(
      and(
        eq(favorite.userId, userId),
        filter?.search ? ilike(movie.title, `%${filter.search}%`) : undefined,
      ),
    );

  return result[0].count;
}
