import Image from "next/image";

// Mock data for movies
const movies = [
  { id: 1, title: "Inception", year: 2010 },
  {
    id: 2,
    title: "The Shawshank Redemption",
    year: 1994,
    poster: null,
  },
  { id: 3, title: "The Dark Knight", year: 2008 },
  { id: 4, title: "Pulp Fiction", year: 1994 },
  { id: 5, title: "Forrest Gump", year: 1994 },
];

export default function MovieList() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={movie.poster || "/images/placeholder.jpg"}
              alt={`${movie.title} poster`}
              width={180}
              height={273}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-600">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
