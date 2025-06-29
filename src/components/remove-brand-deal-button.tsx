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
      variant="outline"
      size="sm"
      onClick={handleRemove}
      disabled={isRemoving}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
