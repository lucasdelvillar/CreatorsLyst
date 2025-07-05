"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addBrandDeal } from "@/app/actions";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddBrandDealDialogProps {
  children: React.ReactNode;
  emailAccounts: any[];
  onAdd?: (deal: any) => void;
}

export function AddBrandDealDialog({
  children,
  emailAccounts,
  onAdd,
}: AddBrandDealDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    brand_name: "",
    sender_email: "",
    email_subject: "",
    note_subject: "",
    offer_amount: "",
    currency: "USD",
    status: "pending",
    deadline: "",
    email_account_id: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const formDataObj = new FormData();
      formDataObj.append("brand_name", formData.brand_name);
      formDataObj.append("sender_email", formData.sender_email);
      formDataObj.append("email_subject", formData.email_subject);
      formDataObj.append("note_subject", formData.note_subject);
      formDataObj.append("offer_amount", formData.offer_amount);
      formDataObj.append("currency", formData.currency);
      formDataObj.append("status", formData.status);
      formDataObj.append("deadline", formData.deadline);
      formDataObj.append("email_account_id", formData.email_account_id);

      await addBrandDeal(formDataObj);
      setOpen(false);
      setFormData({
        brand_name: "",
        sender_email: "",
        email_subject: "",
        note_subject: "",
        offer_amount: "",
        currency: "USD",
        status: "pending",
        deadline: "",
        email_account_id: "",
      });
      router.refresh();
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Brand Deal
          </DialogTitle>
          <DialogDescription>
            Manually add a brand collaboration opportunity to your dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) =>
                  handleInputChange("brand_name", e.target.value)
                }
                placeholder="Enter brand name"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sender_email">Contact Email *</Label>
              <Input
                id="sender_email"
                type="email"
                value={formData.sender_email}
                onChange={(e) =>
                  handleInputChange("sender_email", e.target.value)
                }
                placeholder="brand@company.com"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_subject">Campaign/Subject *</Label>
            <Input
              id="email_subject"
              value={formData.email_subject}
              onChange={(e) =>
                handleInputChange("email_subject", e.target.value)
              }
              placeholder="Enter campaign name or email subject"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note_subject">Description/Notes</Label>
            <Textarea
              id="note_subject"
              value={formData.note_subject}
              onChange={(e) =>
                handleInputChange("note_subject", e.target.value)
              }
              placeholder="Enter campaign details, requirements, or notes..."
              rows={4}
              className="resize-none"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offer_amount">Offer Amount</Label>
              <Input
                id="offer_amount"
                type="number"
                step="0.01"
                value={formData.offer_amount}
                onChange={(e) =>
                  handleInputChange("offer_amount", e.target.value)
                }
                placeholder="0.00"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
                disabled={isPending}
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

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={isPending}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_account_id">Associated Email Account</Label>
              <Select
                value={formData.email_account_id}
                onValueChange={(value) =>
                  handleInputChange("email_account_id", value)
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select email account (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {emailAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.email_address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Brand Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
