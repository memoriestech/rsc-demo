import { auth, login } from "@/app/actions";
import { ImdbImage } from "@/components/movie/imdb-image";
import { SearchFavoriteInput } from "@/components/movie/search-favorites-input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { countFavoriteMovies, getFavoriteMovies, removeFavoriteMovie } from "@/db/movie";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const subject = await auth();

  if (!subject) {
    return login();
  }

  const userId = Number.parseInt(subject.properties.id);
  const sparams = await searchParams;

  const page = typeof sparams.page === "string" ? Number.parseInt(sparams.page) : 1;
  const limit = typeof sparams.limit === "string" ? Number.parseInt(sparams.limit) : 10;
  const search = typeof sparams.search === "string" ? sparams.search : undefined;

  const movies = await getFavoriteMovies(userId, { page, limit, search });
  const total = await countFavoriteMovies(userId, { search });

  const lastPage = Math.ceil(total / limit);

  if (total === 0 && !search) {
    return <p className="text-muted-foreground">Add movies to get started.</p>;
  }

  return (
    <main>
      <SearchFavoriteInput />

      <p className="mt-4 mb-2 text-sm text-muted-foreground">
        {total} {search ? "" : "favorite"} movies {search ? "found" : ""}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {movies.map((movie) => (
          <li key={movie.id} className="relative group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ImdbImage
                poster={movie.poster}
                alt={`${movie.title} poster`}
                width={185}
                height={0}
                className="w-full h-auto object-cover"
              />
            </div>

            <h2 className="font-semibold mb-1 mt-2">{movie.title}</h2>
            <p className="text-gray-600 text-sm">
              {movie.release && new Date(movie.release).getFullYear()}
            </p>

            <form
              className="absolute top-2 right-2 hidden group-hover:inline-flex"
              action={async () => {
                "use server";
                await removeFavoriteMovie(userId, movie.id);
                revalidatePath("/");
              }}
            >
              <Button variant="secondary" className="bg-secondary/70">
                <span className="sr-only">Favorite</span>
                <Trash2 className="h-5 w-5" />
              </Button>
            </form>
          </li>
        ))}
      </ul>

      {total > limit && (
        <Pagination className="mt-4">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${page - 1}&limit=${limit}`} />
              </PaginationItem>
            )}

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} href={`?page=${p}&limit=${limit}`}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < lastPage && (
              <PaginationItem>
                <PaginationNext href={`?page=${page + 1}&limit=${limit}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
