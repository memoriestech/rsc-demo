import { auth } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { login, logout } from "./actions";
import "./globals.css";
import { ThemeToggle } from "./theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Movies",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {modal}
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <Button asChild>
                <Link href="/add-movie">
                  <PlusIcon className="w-6 h-6" />
                  Add Movie
                </Link>
              </Button>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <LogoutButton />
              </div>
            </div>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

async function LogoutButton() {
  const subject = await auth();

  if (!subject) {
    await login();
    return null;
  }

  return (
    <form action={logout}>
      <Button variant="link">Logout</Button>
    </form>
  );
}
