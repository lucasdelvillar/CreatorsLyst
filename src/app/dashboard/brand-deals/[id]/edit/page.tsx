import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import EditBrandDealForm from "@/components/edit-brand-deal-form";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";

interface EditBrandDealPageProps {
  params: {
    id: string;
  };
}

export default async function EditBrandDealPage({
  params,
}: EditBrandDealPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get the brand deal
  const { data: brandDeal, error } = await supabase
    .from("brand_deals")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !brandDeal) {
    return redirect("/dashboard");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Brand Deal
              </h1>
              <p className="text-gray-600">
                Update the details of your brand collaboration
              </p>
            </div>

            <EditBrandDealForm brandDeal={brandDeal} />
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
