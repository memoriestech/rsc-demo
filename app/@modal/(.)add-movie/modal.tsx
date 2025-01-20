"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";

export function Modal({ children, title }: React.PropsWithChildren<{ title: string }>) {
  const router = useRouter();
  const path = usePathname();

  const isOpen = path === "/add-movie";

  return (
    <Dialog defaultOpen={isOpen} open={isOpen} onOpenChange={() => router.push("/")}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
