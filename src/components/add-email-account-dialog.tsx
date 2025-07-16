"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { addEmailAccount } from "@/app/actions";
import { connectGmailAccount } from "@/app/actions";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddEmailAccountDialogProps {
  children: React.ReactNode;
}

export function AddEmailAccountDialog({
  children,
}: AddEmailAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      // Add the email account (Gmail accounts will automatically redirect to OAuth)
      await addEmailAccount(formData);
      setOpen(false);
    } catch (error) {
      console.error("Error adding email account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add Email Account
          </DialogTitle>
          <DialogDescription>
            Connect your email account to automatically track brand deal
            opportunities.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email_address">Email Address</Label>
            <Input
              id="email_address"
              name="email_address"
              type="email"
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Email Provider</Label>
            <Select
              name="provider"
              required
              disabled={isLoading}
              onValueChange={setProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your email provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              What happens next?
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {provider === "gmail" ? (
                <>
                  <li>• We'll add your Gmail account to the system</li>
                  <li>• You'll be redirected to authorize Gmail access</li>
                  <li>• Our AI will scan for brand collaboration emails</li>
                  <li>• Deals will appear in your dashboard automatically</li>
                </>
              ) : provider === "outlook" ? (
                <>
                  <li>• We'll add your Outlook account to the system</li>
                  <li>• Outlook integration is coming soon</li>
                  <li>• You'll be notified when it's available</li>
                </>
              ) : (
                <>
                  <li>• We'll securely connect to your email account</li>
                  <li>• Our AI will scan for brand collaboration emails</li>
                  <li>• Deals will appear in your dashboard automatically</li>
                  <li>• You can respond directly from the platform</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Adding..."
                : provider === "gmail"
                  ? "Add & Connect Gmail"
                  : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
