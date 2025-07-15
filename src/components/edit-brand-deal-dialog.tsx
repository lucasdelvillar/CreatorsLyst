"use client";

import { useState, useTransition } from "react";
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
import { updateBrandDeal } from "@/app/actions";
import { useRouter } from "next/navigation";

interface BrandDeal {
  id: string;
  brand_name: string;
  campaign_name: string;
  sender_email: string;
  email_subject: string;
  email_body: string;
  note_subject: string | null;
  offer_amount: number | null;
  currency: string;
  status: string;
  deadline: string | null;
}

interface EditBrandDealDialogProps {
  brandDeal: BrandDeal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditBrandDealDialog({
  brandDeal,
  open,
  onOpenChange,
}: EditBrandDealDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    brand_name: brandDeal.brand_name || "",
    campaign_name: brandDeal.campaign_name || "",
    email_subject: brandDeal.email_subject || "",
    email_body: brandDeal.email_body || "",
    offer_amount: brandDeal.offer_amount?.toString() || "",
    currency: brandDeal.currency || "USD",
    status: brandDeal.status || "pending",
    deadline: brandDeal.deadline || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const formDataObj = new FormData();
      formDataObj.append("brand_name", formData.brand_name);
      formDataObj.append("campaign_name", formData.campaign_name);
      formDataObj.append("sender_email", brandDeal.sender_email); // Keep original sender email
      formDataObj.append("email_subject", formData.email_subject);
      formDataObj.append("email_body", formData.email_body); // Keep original
      formDataObj.append("offer_amount", formData.offer_amount);
      formDataObj.append("currency", formData.currency);
      formDataObj.append("status", formData.status);
      formDataObj.append("deadline", formData.deadline);

      await updateBrandDeal(brandDeal.id, formDataObj);
      onOpenChange(false);
      router.refresh();
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Brand Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand_name">Brand Name</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => handleInputChange("brand_name", e.target.value)}
              placeholder="Enter brand name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_email">Sender Email</Label>
            <Input
              id="sender_email"
              value={brandDeal.sender_email}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign_name">Campaign</Label>
            <Input
              id="campaign_name"
              value={formData.campaignName}
              onChange={(e) =>
                handleInputChange("campaign_name", e.target.value)
              }
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offer_amount">Fee</Label>
              <Input
                id="offer_amount"
                type="number"
                step="0.01"
                value={formData.offer_amount}
                onChange={(e) =>
                  handleInputChange("offer_amount", e.target.value)
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Due Date</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
