"use server";
import { db } from "@/db";
import { favorite, movie } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

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

export async function getFavoriteMovies(userId: number) {
  const result = await db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, userId))
    .innerJoin(movie, eq(favorite.movieId, movie.id))
    .orderBy(sql`${movie.id} desc`);

  return result.map((m) => m.movie);
}
