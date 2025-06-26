import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, CheckCircle, XCircle } from "lucide-react";
import { AddEmailAccountDialog } from "./add-email-account-dialog";
import RemoveEmailAccountButton from "./remove-email-account-button";

interface EmailAccount {
  id: string;
  email_address: string;
  provider: string;
  is_connected: boolean;
  created_at: string;
}

interface EmailAccountsProps {
  accounts: EmailAccount[];
  subscriptionTier: string;
  limits: {
    emailAccounts: number;
    activeDeals: number;
  };
  activeDealsCount: number;
}

export default function EmailAccounts({
  accounts = [],
  subscriptionTier = "starter",
  limits = { emailAccounts: 1, activeDeals: 5 },
  activeDealsCount = 0,
}: EmailAccountsProps) {
  const canAddMore =
    limits.emailAccounts === -1 || accounts.length < limits.emailAccounts;

  return (
    <div className="bg-white space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Accounts</h2>
          <p className="text-gray-600 mt-1">
            Manage your connected email accounts for brand deal tracking
          </p>
        </div>
        {canAddMore && (
          <AddEmailAccountDialog>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Email Account
            </Button>
          </AddEmailAccountDialog>
        )}
      </div>

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {subscriptionTier}
            </Badge>
            Plan Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email Accounts</p>
              <p className="text-lg font-semibold">
                {accounts.length} /{" "}
                {limits.emailAccounts === -1 ? "∞" : limits.emailAccounts}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Deals</p>
              <p className="text-lg font-semibold">
                {activeDealsCount} /{" "}
                {limits.activeDeals === -1 ? "∞" : limits.activeDeals}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Accounts List */}
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No email accounts connected
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Connect your email account to start tracking brand deals
                automatically
              </p>
              {canAddMore && (
                <AddEmailAccountDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Email Account
                  </Button>
                </AddEmailAccountDialog>
              )}
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {account.email_address}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {account.provider}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {account.is_connected ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">
                              Connected
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">
                              Not Connected
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!account.is_connected && (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                  <RemoveEmailAccountButton accountId={account.id} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Upgrade Notice */}
      {!canAddMore && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-orange-900">
                  Email Account Limit Reached
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Your {subscriptionTier} plan allows {limits.emailAccounts}{" "}
                  email account{limits.emailAccounts > 1 ? "s" : ""}. Upgrade to
                  add more accounts.
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
