"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { connectGmailAccount } from "@/app/actions";
import { useTransition } from "react";

interface ConnectGmailButtonProps {
  accountId: string;
}

export default function ConnectGmailButton({
  accountId,
}: ConnectGmailButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleConnect = () => {
    startTransition(async () => {
      await connectGmailAccount(accountId);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleConnect}
      disabled={isPending}
      className="flex items-center gap-2"
    >
      <Mail className="h-4 w-4" />
      {isPending ? "Connecting..." : "Connect"}
    </Button>
  );
}
