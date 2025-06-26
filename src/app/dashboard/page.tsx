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

  // Get user's email accounts and active deals count
  const emailAccounts = await getUserEmailAccounts(user.id);
  const activeDealsCount = await getUserActiveDealsCount(user.id);

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
        </div>
      </main>
    </SubscriptionCheck>
  );
}
