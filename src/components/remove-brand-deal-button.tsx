"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeBrandDeal } from "@/app/actions";
import { useTransition } from "react";

interface RemoveBrandDealButtonProps {
  brandDealId: string;
}

export default function RemoveBrandDealButton({
  brandDealId,
}: RemoveBrandDealButtonProps) {
  const [isRemoving, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await removeBrandDeal(brandDealId);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={isRemoving}
      className="text-red-600 hover:text-red-700 "
    >
      <div className="flex gap-2 items-center">
        <Trash2 className="h-4 w-4" />
        Delete
      </div>
    </Button>
  );
}
