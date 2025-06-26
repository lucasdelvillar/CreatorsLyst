"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeEmailAccount } from "@/app/actions";
import { useTransition } from "react";

interface RemoveEmailAccountButtonProps {
  accountId: string;
}

export default function RemoveEmailAccountButton({
  accountId,
}: RemoveEmailAccountButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await removeEmailAccount(accountId);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRemove}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
