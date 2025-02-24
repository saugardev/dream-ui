import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <Image 
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          priority
        />
      </div>
      <Button>Launch App</Button>
    </nav>
  );
}