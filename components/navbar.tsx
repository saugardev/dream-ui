import Link from "next/link";
import { Button } from "./ui/button";
import { Settings, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-4 bg-card rounded-xl border border-border my-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center text-primary">
          <Image src="/logo.svg" alt="logo" width={32} height={32} className="rounded-[4px]"/>
        </div>
        <span className="font-bold text-lg">Dream</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
        <Link href="/dashboard">
          <Button>Launch App</Button>
        </Link>
      </div>
    </nav>
  );
}