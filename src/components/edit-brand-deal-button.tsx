"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditBrandDealButtonProps {
  onClick: () => void;
}

export default function EditBrandDealButton({
  onClick,
}: EditBrandDealButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-blue-600 hover:text-blue-700 w-full justify-start"
      onClick={onClick}
    >
      <div className="flex gap-2 items-center">
        <Edit className="h-4 w-4" />
        Edit
      </div>
    </Button>
  );
}
