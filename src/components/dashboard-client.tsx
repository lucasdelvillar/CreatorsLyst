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
import NotesButton from "@/components/read-write-notes-button";
import NotesDialog from "@/components/read-write-notes-dialog";
import { AddBrandDealDialog } from "@/components/add-brand-deal-dialog";
import { Ellipsis, Plus } from "lucide-react";

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

  const [editingNotes, setEditingNotes] = useState<any>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const handleEditDeal = (deal: any) => {
    setEditingDeal(deal);
    setIsEditDialogOpen(true);
  };

  const handleNote = (deal: any) => {
    setEditingNotes(deal);
    setIsNoteDialogOpen(true);
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
          <section className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Brand Deals
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your brand collaboration opportunities
                </p>
              </div>
              <AddBrandDealDialog emailAccounts={emailAccounts}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Brand Deal
                </Button>
              </AddBrandDealDialog>
            </div>

            {brandDeals.length > 0 ? (
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
                              {deal.campaign_name}
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
                                    timeZone: "UTC",
                                  },
                                )
                              : new Date(deal.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    timeZone: "UTC",
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
                                    <NotesButton
                                      onClick={() => handleNote(deal)}
                                    />
                                  </DropdownMenuItem>
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
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No brand deals yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by connecting your email accounts to automatically
                    scan for deals, or add one manually.
                  </p>
                  <AddBrandDealDialog emailAccounts={emailAccounts}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Brand Deal
                    </Button>
                  </AddBrandDealDialog>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Edit Brand Deal Dialog */}
        {editingDeal && (
          <EditBrandDealDialog
            brandDeal={editingDeal}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
        )}

        {/* Notes Dialog */}
        {editingNotes && (
          <NotesDialog
            brandDeal={editingNotes}
            open={isNoteDialogOpen}
            onOpenChange={setIsNoteDialogOpen}
          />
        )}
      </main>
    </>
  );
}
