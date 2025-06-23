import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Steps from "@/components/steps.tsx";
import Features from "@/components/features.tsx";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import { ArrowUpRight, CheckCircle2, Zap, Shield, Users } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  console.log("Plans fetched from Supabase:", plans);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Steps />
      <Features />

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 flex flex-col">
              <span className=""> No Fluff, </span>
              <span> Just Features You&apos;ll use </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {plans
              ?.sort((a: any, b: any) => a.amount - b.amount)
              .map((item: any) => (
                <PricingCard key={item.id} item={item} user={user} />
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Organize Your Brand Deals?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join content creators and influencers who've streamlined their
            collaboration workflow with our platform.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Free Trial
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
