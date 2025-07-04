"use client";

import { Button } from "@/components/ui/button";
import { StickyNote } from "lucide-react";

interface ReadWriteNotesButtonProps {
  onClick: () => void;
}

export default function ReadWriteNotesButton({
  onClick,
}: ReadWriteNotesButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-black w-full justify-start"
      onClick={onClick}
    >
      <div className="flex gap-2 items-center">
        <StickyNote className="h-4 w-4" />
        Notes
      </div>
    </Button>
  );
}
