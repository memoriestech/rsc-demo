import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "./actions";

export function Nav() {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link href="/">
        <h1 className="text-3xl font-bold">My Movies</h1>
      </Link>

      <form action={logout}>
        <Button variant="link">Logout</Button>
      </form>
    </div>
  );
}
