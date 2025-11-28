"use client";

import Link from "next/link";
import { Film } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">Media Harvester</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
           {pathname !== "/tool" && (
             <Link href="/tool">
                <Button>Go to App</Button>
             </Link>
           )}
        </div>
      </div>
    </nav>
  );
}
