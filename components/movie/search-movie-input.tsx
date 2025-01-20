"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function SearchMovieInput() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    if (!query) {
      router.push("/add-movie");
    } else {
      router.push(`/add-movie/?query=${encodeURI(query)}`);
    }
  }, [query, router.push]);

  return (
    <div>
      <form
        className="flex w-full max-w-md items-center space-x-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Search by movie title"
          autoFocus
        />
      </form>
    </div>
  );
}
