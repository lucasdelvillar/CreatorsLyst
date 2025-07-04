"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateNote } from "@/app/actions";
import { useRouter } from "next/navigation";

interface BrandDeal {
  id: string;
  brand_name: string;
  sender_email: string;
  email_subject: string;
  note_subject: string | null;
  offer_amount: number | null;
  currency: string;
  status: string;
  deadline: string | null;
}

interface NoteDialogProps {
  brandDeal: BrandDeal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NoteDialog({
  brandDeal,
  open,
  onOpenChange,
}: NoteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    note_subject: brandDeal.note_subject || "",
  });

  useEffect(() => {
    setFormData({
      note_subject: brandDeal.note_subject || "",
    });
  }, [brandDeal.note_subject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const formDataObj = new FormData();
      formDataObj.append("note_subject", formData.note_subject);

      await updateNote(brandDeal.id, formDataObj);
      onOpenChange(false);
      router.refresh();
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit and View Your Notes</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="note_subject">Note</Label>
          <Textarea
            id="note_subject"
            value={formData.note_subject}
            onChange={(e) => handleInputChange("note_subject", e.target.value)}
            placeholder="Write your note here..."
            rows={10}
            className="resize-y min-h-[150px]"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
