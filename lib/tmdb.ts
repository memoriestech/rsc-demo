import type { MovieInput } from "@/db/schema";
import { Resource } from "sst";

const TMDB_API_KEY = Resource.TMDB_API_KEY.value;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type SearchMoviesResponse = {
  page: number;
  total_results: number;
  total_pages: number;
  results: Array<{
    id: number;
    title: string;
    release_date: string;
    overview: string;
    vote_average: number;
    poster_path: string;
  }>;
};

export async function searchMoviesByTitle(title: string, page = 1): Promise<MovieInput[]> {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&page=${page}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = (await response.json()) as SearchMoviesResponse;

    return data.results.map((m) => ({
      tmdbId: m.id,
      title: m.title,
      description: m.overview,
      release: m.release_date,
      rating: m.vote_average.toString(),
      poster: m.poster_path,
    }));
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    throw new Error("Failed to fetch movies. Please try again later.");
  }
}
