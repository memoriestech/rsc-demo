import { auth, login } from "@/app/actions";
import { ImdbImage } from "@/components/movie/imdb-image";
import { Card } from "@/components/ui/card";
import { getFavoriteMovies } from "@/db/movie";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MovieList() {
  const subject = await auth();

  if (!subject) {
    return login();
  }

  const movies = await getFavoriteMovies(Number.parseInt(subject.properties.id));

  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <Link href="/add-movie">
          <Card className="w-full h-full flex flex-col justify-center items-center hover:bg-muted gap-4">
            <Plus className="w-10 h-10 text-muted-foreground" />
            <span className="text-muted-foreground font-semibold text-lg">Add Movie</span>
          </Card>
        </Link>

        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <ImdbImage
              poster={movie.poster}
              alt={`${movie.title} poster`}
              width={185}
              height={0}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-600">
                {movie.release && new Date(movie.release).getFullYear()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
