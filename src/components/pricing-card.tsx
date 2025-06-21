"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";
import { CheckCircle2 } from "lucide-react";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Default features for all plans
  const features: Record<string, string[]> = {
    price_1OSrPUFQRFibPDrOJoWhFhOq: [
      // starter
      "Connect 1 inbox (Gmail, Outlook, etc.)",
      "Auto-organize brand deal emails (filters & labels)",
      "Brand deal tracking (status: new, responded, completed)",
      "5 active deals at a time",
    ],
    price_1RcHTXFQRFibPDrOf9N91VcP: [
      // pro
      "Connect 3 inboxes (Gmail, Outlook, etc.)",
      "Auto-organize brand deal emails (filters & labels)",
      "Brand deal tracking (status: new, responded, completed)",
      "30 active deals at a time",
    ],
    price_1RcHUyFQRFibPDrOFxEMiEbp: [
      // studio
      "Unlimited inbox Connections (Gmail, Outlook, etc.)",
      "Auto-organize brand deal emails (filters & labels)",
      "Brand deal tracking (status: new, responded, completed)",
      "Unlimited active deals at a time",
    ],
  };

  // Determine border style based on plan
  const getPricingCardBorderStyle = () => {
    if (item.product_name === "Studio") return "border-2 border-orange-500";
    if (item.product_name === "Pro") return "border-2 border-purple-500";
    return "border border-gray-200";
  };

  const getPricingCardButtonStyle = () => {
    if (item.product_name === "Studio")
      return "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-70";
    if (item.product_name === "Pro")
      return "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:opacity-70";
    return "bg-black hover:bg-black/70";
  };

  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/login?redirect=pricing";
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <Card
      className={`w-[350px] relative overflow-hidden ${item.popular ? "border-2 border-blue-500 shadow-xl scale-105" : "border border-gray-200"} ${getPricingCardBorderStyle()}`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          <span
            className={
              item.product_name === "Studio"
                ? "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent font-extrabold"
                : item.product_name === "Pro"
                  ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent font-extrabold"
                  : "text-gray-900"
            }
          >
            {item.product_name || item.name}
          </span>
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-gray-900">
            ${item?.amount / 100}
          </span>
          <span className="text-gray-600">/{item?.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-3">
          {features[item.id].map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium ${getPricingCardButtonStyle()}`}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
