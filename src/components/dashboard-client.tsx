"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import DashboardNavbar from "@/components/dashboard-navbar";
import EmailAccounts from "@/components/email-accounts";
import RemoveBrandDeal from "@/components/remove-brand-deal-button";
import EditBrandDealButton from "@/components/edit-brand-deal-button";
import EditBrandDealDialog from "@/components/edit-brand-deal-dialog";
import { Ellipsis } from "lucide-react";

interface DashboardClientProps {
  user: any;
  subscriptionTier: string;
  limits: any;
  emailAccounts: any[];
  activeDealsCount: number;
  brandDeals: any[];
}

export default function DashboardClient({
  user,
  subscriptionTier,
  limits,
  emailAccounts,
  activeDealsCount,
  brandDeals,
}: DashboardClientProps) {
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditDeal = (deal: any) => {
    setEditingDeal(deal);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your brand deal opportunities and email connections
            </p>
          </header>

          {/* Email Accounts Section */}
          <EmailAccounts
            accounts={emailAccounts}
            subscriptionTier={subscriptionTier}
            limits={limits}
            activeDealsCount={activeDealsCount}
          />

          {/* Brand Deals Section */}
          {brandDeals.length > 0 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Brand Deals
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your brand collaboration opportunities
                </p>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campaign
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {brandDeals.map((deal: any) => (
                        <tr key={deal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {deal.brand_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {deal.sender_email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {deal.email_subject}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {deal.offer_amount
                                ? `${deal.currency || "USD"} ${deal.offer_amount.toLocaleString()}`
                                : "Not specified"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                deal.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : deal.status === "responded"
                                    ? "bg-blue-100 text-blue-800"
                                    : deal.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : deal.status === "declined"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {deal.status || "pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {deal.deadline
                              ? new Date(deal.deadline).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                  },
                                )
                              : new Date(deal.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                  },
                                )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-4 items-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="focus:outline-none focus:ring-0 focus-visible:ring-0"
                                  >
                                    <Ellipsis className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center">
                                  <DropdownMenuItem>
                                    <EditBrandDealButton
                                      onClick={() => handleEditDeal(deal)}
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <RemoveBrandDeal brandDealId={deal.id} />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Edit Brand Deal Dialog */}
        {editingDeal && (
          <EditBrandDealDialog
            brandDeal={editingDeal}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}
      </main>
    </>
  );
}
