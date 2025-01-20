import { AddMovie } from "@/components/movie/add-movie";
import { SearchMovieInput } from "@/components/movie/search-movie-input";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AddMoviePage({ searchParams }: PageProps) {
  const { query } = await searchParams;

  return (
    <main>
      <SearchMovieInput />
      <AddMovie query={typeof query === "string" ? query : undefined} />
    </main>
  );
}
