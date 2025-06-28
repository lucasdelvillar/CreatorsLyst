import DashboardNavbar from "@/components/dashboard-navbar";
import EmailAccounts from "@/components/email-accounts";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  getUserSubscriptionTier,
  getSubscriptionLimits,
  getUserEmailAccounts,
  getUserActiveDealsCount,
  getUserBrandDeals,
} from "@/app/actions";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  console.log("start of debug session: Dashboard");

  // Get user's subscription tier and limits
  const subscriptionTier = await getUserSubscriptionTier(user.id);
  const limits = await getSubscriptionLimits(subscriptionTier);

  // Get user's email accounts, active deals count, and brand deals
  const emailAccounts = await getUserEmailAccounts(user.id);
  const activeDealsCount = await getUserActiveDealsCount(user.id);
  const brandDeals = await getUserBrandDeals(user.id);

  // DEBUG
  //console.log(emailAccounts);
  //console.log(activeDealsCount);

  return (
    <SubscriptionCheck>
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
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Offer Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
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
                            {new Date(deal.created_at).toLocaleDateString()}
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
      </main>
    </SubscriptionCheck>
  );
}
