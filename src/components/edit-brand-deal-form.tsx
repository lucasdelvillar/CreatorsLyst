"use client";

import { useState, useTransition } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateBrandDeal } from "@/app/actions";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BrandDeal {
  id: string;
  brand_name: string;
  sender_email: string;
  email_subject: string;
  email_body: string;
  offer_amount: number | null;
  currency: string;
  status: string;
  deadline: string | null;
}

interface EditBrandDealFormProps {
  brandDeal: BrandDeal;
}

export default function EditBrandDealForm({
  brandDeal,
}: EditBrandDealFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    brand_name: brandDeal.brand_name || "",
    sender_email: brandDeal.sender_email || "",
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
      formDataObj.append("sender_email", formData.sender_email);
      formDataObj.append("email_subject", formData.email_subject);
      formDataObj.append("email_body", formData.email_body);
      formDataObj.append("offer_amount", formData.offer_amount);
      formDataObj.append("currency", formData.currency);
      formDataObj.append("status", formData.status);
      formDataObj.append("deadline", formData.deadline);

      await updateBrandDeal(brandDeal.id, formDataObj);
      router.push("/dashboard");
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  value={formData.brand_name}
                  onChange={(e) =>
                    handleInputChange("brand_name", e.target.value)
                  }
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender_email">Sender Email</Label>
                <Input
                  id="sender_email"
                  type="email"
                  value={formData.sender_email}
                  onChange={(e) =>
                    handleInputChange("sender_email", e.target.value)
                  }
                  placeholder="Enter sender email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_subject">Email Subject</Label>
              <Input
                id="email_subject"
                value={formData.email_subject}
                onChange={(e) =>
                  handleInputChange("email_subject", e.target.value)
                }
                placeholder="Enter email subject"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_body">Email Body</Label>
              <Textarea
                id="email_body"
                value={formData.email_body}
                onChange={(e) =>
                  handleInputChange("email_body", e.target.value)
                }
                placeholder="Enter email body"
                rows={6}
                className="resize-none"
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
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

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Updating..." : "Update Brand Deal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
