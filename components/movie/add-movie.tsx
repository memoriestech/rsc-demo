import { auth } from "@/app/actions";
import { SearchResult } from "@/components/movie/search-result";
import { getFavoriteMovies } from "@/db/movie";
import { searchMoviesByTitle } from "@/lib/tmdb";

export async function AddMovie({ query }: { query?: string }) {
  const subject = await auth();

  if (!subject) {
    return null;
  }

  const userId = Number.parseInt(subject.properties.id);

  const [movies, favorites] = await Promise.all([
    searchMoviesByTitle(query || ""),
    getFavoriteMovies(userId),
  ]);

  if (query && movies?.length === 0) {
    return <p className="mt-4 text-muted-foreground">No movies found</p>;
  }

  return (
    <>
      {query && (
        <p className="my-2 text-sm text-muted-foreground">Total {movies.length} movies found</p>
      )}
      <SearchResult movies={movies} favorites={favorites} userId={userId} />
    </>
  );
}
