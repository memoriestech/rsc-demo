"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function SearchFavoriteInput() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    if (!query) {
      router.push("/");
    } else {
      router.push(`/?search=${encodeURI(query)}`);
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
          type="search"
          placeholder="Filter favorite movies by title"
          autoFocus
        />
      </form>
    </div>
  );
}
