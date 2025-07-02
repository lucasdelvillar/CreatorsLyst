import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import {
  getUserSubscriptionTier,
  getSubscriptionLimits,
  getUserEmailAccounts,
  getUserActiveDealsCount,
  getUserBrandDeals,
} from "@/app/actions";
import DashboardClient from "@/components/dashboard-client";
import { SubscriptionCheck } from "@/components/subscription-check";

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
      <DashboardClient
        user={user}
        subscriptionTier={subscriptionTier}
        limits={limits}
        emailAccounts={emailAccounts}
        activeDealsCount={activeDealsCount}
        brandDeals={brandDeals}
      />
    </SubscriptionCheck>
  );
}
