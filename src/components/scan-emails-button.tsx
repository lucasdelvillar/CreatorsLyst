"use client";

import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { scanEmailsForBrandDeals } from "@/app/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface ScanEmailsButtonProps {
  accountId: string;
  isConnected: boolean;
}

export default function ScanEmailsButton({
  accountId,
  isConnected,
}: ScanEmailsButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleScan = () => {
    startTransition(async () => {
      try {
        await scanEmailsForBrandDeals(accountId);
        router.refresh(); // Refresh the page to show new deals
      } catch (error) {
        console.error("Error scanning emails:", error);
      }
    });
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleScan}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
      {isPending ? "Scanning..." : "Scan for Deals"}
    </Button>
  );
}
