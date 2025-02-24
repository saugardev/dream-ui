import { Button } from "./ui/button";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full">
        <span className="text-sm font-medium">LIVE ON TESTNET</span>
        <Link href="#" target="_blank">
          <LinkIcon className="w-4 h-4" />
        </Link>
      </div>

      <h1 className="text-6xl font-bold mb-4 mt-4">
        Ready to Dream?
      </h1>

      <h2 className="text-xl text-muted-foreground mb-8">
        On-chain collateralized index markets with stability
      </h2>

      <div className="flex gap-4">
        <Button size="lg">Launch App</Button>
        <Button variant="ghost" size="lg">Documentation</Button>
      </div>
    </div>
  );
}
