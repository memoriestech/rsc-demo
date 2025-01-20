"use client";

import { ImdbImage } from "@/components/movie/imdb-image";
import { Button } from "@/components/ui/button";
import { addFavoriteMovie, getOrCreateMovie, removeFavoriteMovie } from "@/db/movie";
import type { MovieInput } from "@/db/schema";
import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";

type MovieWithFavorite = MovieInput & { favorite: boolean };

type Props = {
  movies: MovieInput[];
  userId: number;
  favorites: MovieInput[];
};

export function SearchResult({ movies, userId, favorites }: Props) {
  const router = useRouter();

  const moviesWithFavorite = movies.map((m) => ({
    ...m,
    favorite: favorites.some((f) => f.tmdbId === m.tmdbId),
  }));

  const [optimisticMovies, setOptimisticMovies] = useOptimistic(
    moviesWithFavorite,
    (state, movie: MovieWithFavorite) => {
      const found = state.find((m) => m.tmdbId === movie.tmdbId);

      if (found) {
        found.favorite = !movie.favorite;
      }

      return state;
    },
  );

  return (
    <ul className="flex flex-col gap-4 w-full pr-2">
      {optimisticMovies?.map((m) => {
        return (
          <li key={m.tmdbId} className="flex gap-4 group">
            <ImdbImage poster={m.poster} alt={m.title} width={92} height={273} />

            <div className="flex flex-col gap-2">
              <span className="font-semibold">{m.title}</span>
              <span className="line-clamp-2">{m.description || "No description available"}</span>

              <div className="flex gap-2 items-center justify-between">
                <span className="text-muted-foreground">
                  {m.release && new Date(m.release).getFullYear()}
                </span>

                <form
                  action={async () => {
                    const movie = await getOrCreateMovie({
                      tmdbId: m.tmdbId,
                      title: m.title,
                      description: m.description,
                      release: m.release,
                      rating: m.rating,
                      poster: m.poster,
                    });

                    setOptimisticMovies({ ...movie, favorite: m.favorite });

                    if (m.favorite) {
                      await removeFavoriteMovie(userId, movie.id);
                    } else {
                      await addFavoriteMovie(userId, movie.id);
                    }

                    router.refresh();
                  }}
                >
                  <Button variant="ghost" size="icon">
                    <HeartIcon
                      className={cn("h-4 w-4", { "fill-rose-400 stroke-rose-400": m.favorite })}
                    />
                  </Button>
                </form>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
