import { AddMovie } from "@/components/movie/add-movie";
import { SearchMovieInput } from "@/components/movie/search-movie-input";
import { Modal } from "./modal";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AddMovieModalPage({ searchParams }: PageProps) {
  const { query } = await searchParams;

  return (
    <Modal title="Add Movie to your list">
      <SearchMovieInput />

      <div className="max-h-[500px] overflow-y-auto">
        <AddMovie query={typeof query === "string" ? query : undefined} />
      </div>
    </Modal>
  );
}
