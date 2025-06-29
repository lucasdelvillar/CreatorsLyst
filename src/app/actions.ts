"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        user_id: user.id,
        name: fullName,
        email: email,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        // Error handling without console.error
        return encodedRedirect(
          "error",
          "/sign-up",
          "Error updating user. Please try again.",
        );
      }
    } catch (err) {
      // Error handling without console.error
      return encodedRedirect(
        "error",
        "/sign-up",
        "Error updating user. Please try again.",
      );
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInWithGoogleAction = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app/auth/callback?redirect_to=/dashboard",
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const signInWithGitHubAction = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo:
        "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app/auth/callback?redirect_to=/dashboard",
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const signInWithFacebookAction = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo:
        "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app/auth/callback?redirect_to=/dashboard",
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const signInWithInstagramAction = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "instagram",
    options: {
      redirectTo:
        "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app/auth/callback?redirect_to=/dashboard",
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};

export const getUserSubscriptionTier = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("price_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error || !subscription) {
    return "starter";
  }

  // Map price IDs to subscription tiers
  const tierMap: { [key: string]: string } = {
    price_1OSrPUFQRFibPDrOJoWhFhOq: "starter",
    price_1RcHTXFQRFibPDrOf9N91VcP: "pro",
    price_1RcHUyFQRFibPDrOFxEMiEbp: "studio",
  };

  return tierMap[subscription.price_id] || "starter";
};

export const getSubscriptionLimits = (tier: string) => {
  const limits = {
    starter: { emailAccounts: 1, activeDeals: 5 },
    pro: { emailAccounts: 3, activeDeals: 30 },
    studio: { emailAccounts: -1, activeDeals: -1 }, // -1 means unlimited
  };

  return limits[tier as keyof typeof limits] || limits.starter;
};

export const addEmailAccount = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/dashboard", "User not authenticated");
  }

  const emailAddress = formData.get("email_address")?.toString();
  const provider = formData.get("provider")?.toString();

  if (!emailAddress || !provider) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Email address and provider are required",
    );
  }

  // Check subscription limits
  const tier = await getUserSubscriptionTier(user.id);
  const limits = getSubscriptionLimits(tier);

  if (limits.emailAccounts !== -1) {
    const { data: existingAccounts } = await supabase
      .from("email_accounts")
      .select("id")
      .eq("user_id", user.id);

    if (existingAccounts && existingAccounts.length >= limits.emailAccounts) {
      return encodedRedirect(
        "error",
        "/dashboard",
        `Your ${tier} plan allows only ${limits.emailAccounts} email account${limits.emailAccounts > 1 ? "s" : ""}. Upgrade to add more.`,
      );
    }
  }

  const { error } = await supabase.from("email_accounts").insert({
    user_id: user.id,
    email_address: emailAddress,
    provider: provider,
    is_connected: false,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return encodedRedirect(
        "error",
        "/dashboard",
        "This email account is already added",
      );
    }
    return encodedRedirect(
      "error",
      "/dashboard",
      "Failed to add email account",
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Email account added successfully",
  );
};

export const removeEmailAccount = async (accountId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/dashboard", "User not authenticated");
  }

  // Get the account details before deletion to revoke permissions
  const { data: account, error: fetchError } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !account) {
    return encodedRedirect("error", "/dashboard", "Email account not found");
  }

  // First, delete all brand deals associated with this email account
  const { error: brandDealsError } = await supabase
    .from("brand_deals")
    .delete()
    .eq("email_account_id", accountId)
    .eq("user_id", user.id);

  if (brandDealsError) {
    console.log("Warning: Error deleting brand deals:", brandDealsError);
    // Continue with account deletion even if brand deals deletion fails
  }

  // Revoke Google OAuth permissions if it's a Gmail account with an access token
  if (account.provider === "gmail" && account.refresh_token) {
    try {
      const revokeResponse = await fetch(
        `https://oauth2.googleapis.com/revoke?token=${account.refresh_token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      // Note: Google's revoke endpoint returns 200 even for invalid tokens
      // so we don't need to handle errors here strictly
      if (!revokeResponse.ok) {
        console.log(
          "Warning: Failed to revoke Google OAuth token, but continuing with account deletion",
        );
      }
    } catch (error) {
      console.log("Warning: Error revoking Google OAuth token:", error);
      // Continue with deletion even if revocation fails
    }
  }

  // Finally, delete the email account
  const { error: deleteError } = await supabase
    .from("email_accounts")
    .delete()
    .eq("id", accountId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.log("Error deleting email account:", deleteError);
    return encodedRedirect(
      "error",
      "/dashboard",
      "Failed to remove email account",
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Email account and all associated brand deals removed successfully",
  );
};

export const getUserEmailAccounts = async (userId: string) => {
  const supabase = await createClient();

  const { data: accounts, error } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return accounts || [];
};

export const getUserActiveDealsCount = async (userId: string) => {
  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from("brand_deals")
    .select("id")
    .eq("user_id", userId)
    .in("status", ["pending", "responded", "accepted"]);

  if (error) {
    return 0;
  }

  return deals?.length || 0;
};

export const connectGmailAccount = async (accountId: string) => {
  // DEBUG
  console.log("Start of actions.ts debug session: connectGmailAccount()");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/dashboard", "User not authenticated");
  }

  // Verify the account belongs to the user
  const { data: account, error: accountError } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single();

  if (accountError || !account) {
    return encodedRedirect("error", "/dashboard", "Email account not found");
  }

  // Generate OAuth URL for Gmail
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app"}/auth/gmail/callback`; // DEBUG: stuck here since my redirect URI is not authorized. Had to update my google cloud console to allow this link to work
  const scope = "https://www.googleapis.com/auth/gmail.readonly";
  const state = accountId; // Pass account ID as state parameter

  if (!clientId) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Gmail integration not configured. Please contact support.",
    );
  }

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent&` +
    `state=${state}`;

  return redirect(authUrl);
};

// used in route.ts
export const handleGmailCallback = async (code: string, state: string) => {
  console.log("=== Gmail Callback Debug Start ===");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("ERROR: User not authenticated");
    return encodedRedirect("error", "/dashboard", "User not authenticated");
  }

  const accountId = state;
  console.log("Account ID from state:", accountId);

  // Verify the account belongs to the user
  const { data: account, error: accountError } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single();

  if (accountError) {
    console.log("Database error finding account:", accountError);
    return encodedRedirect("error", "/dashboard", "Email account not found");
  }

  if (!account) {
    console.log("No account found for ID:", accountId);
    return encodedRedirect("error", "/dashboard", "Email account not found");
  }

  console.log("Found account:", {
    id: account.id,
    email: account.email_address,
    provider: account.provider,
    isConnected: account.is_connected,
  });

  // Validate environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  console.log("Environment check:", {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId?.length || 0,
    clientSecretLength: clientSecret?.length || 0,
  });

  if (!clientId || !clientSecret) {
    console.log("ERROR: Missing Google OAuth credentials");
    return encodedRedirect(
      "error",
      "/dashboard",
      "Gmail integration not configured. Missing OAuth credentials.",
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app"}/auth/gmail/callback`;

    console.log("=== Token Exchange Request ===");
    console.log("Redirect URI:", redirectUri);
    console.log("Code length:", code.length);
    console.log(
      "Client ID (first 20 chars):",
      clientId.substring(0, 20) + "...",
    );

    const requestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    };

    console.log("Request body keys:", Object.keys(requestBody));

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(requestBody),
    });

    console.log("=== Token Response ===");
    console.log("Status:", tokenResponse.status);
    console.log("Status Text:", tokenResponse.statusText);
    console.log(
      "Headers:",
      Object.fromEntries(tokenResponse.headers.entries()),
    );

    const tokenData = await tokenResponse.json();
    console.log("Response body:", JSON.stringify(tokenData, null, 2));

    if (!tokenResponse.ok) {
      const errorMessage =
        tokenData.error_description ||
        tokenData.error ||
        "Failed to get access token";
      console.log("=== TOKEN EXCHANGE FAILED ===");
      console.log("Error:", errorMessage);
      console.log("Full error object:", tokenData);

      // Provide more specific error messages
      if (tokenData.error === "invalid_client") {
        throw new Error(
          "Invalid Google OAuth client credentials. Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        );
      } else if (tokenData.error === "invalid_grant") {
        throw new Error(
          "Invalid authorization code. The code may have expired or already been used.",
        );
      } else if (tokenData.error === "redirect_uri_mismatch") {
        throw new Error(
          `Redirect URI mismatch. Expected: ${redirectUri}. Please check your Google Cloud Console OAuth settings.`,
        );
      }

      throw new Error(errorMessage);
    }

    if (!tokenData.access_token) {
      console.log("ERROR: No access token in response");
      throw new Error("No access token received from Google");
    }

    console.log("=== Updating Database ===");
    console.log(
      "Access token received (first 20 chars):",
      tokenData.access_token.substring(0, 20) + "...",
    );
    console.log("Has refresh token:", !!tokenData.refresh_token);

    // Update the email account with the access token
    const { error: updateError } = await supabase
      .from("email_accounts")
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        is_connected: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId)
      .eq("user_id", user.id);

    if (updateError) {
      console.log("ERROR: Database update failed:", updateError);
      throw new Error("Failed to update email account in database");
    }

    console.log("=== SUCCESS ===");
    console.log("Gmail account connected successfully for account:", accountId);

    // Trigger email scanning after successful connection
    try {
      await scanEmailsForBrandDeals(accountId);
    } catch (scanError) {
      console.log("Warning: Email scanning failed:", scanError);
      // Don't fail the connection if scanning fails
    }

    return encodedRedirect(
      "success",
      "/dashboard",
      "Gmail account connected successfully! Scanning for brand deals...",
    );
  } catch (error) {
    // this will also catch NEXT_REDIRECT which isn't an actual error
    // I can safely ignore that error
    // console.log("=== FINAL ERROR ===");
    // console.log("Error type:", typeof error);
    // console.log(
    //   "Error message:",
    //   error instanceof Error ? error.message : String(error),
    // );
    // console.log(
    //   "Error stack:",
    //   error instanceof Error ? error.stack : "No stack trace",
    // );

    return encodedRedirect(
      "error",
      "/dashboard",
      `Failed to connect Gmail account: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const scanEmailsForBrandDeals = async (accountId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get subscription tier limits
  const tier = await getSubscriptionLimits(user.id);
  const limits = await getSubscriptionLimits(tier);

  let activeDealsCount = await getUserActiveDealsCount(user.id);

  if (limits.activeDeals !== -1 && activeDealsCount >= limits.activeDeals) {
    return encodedRedirect(
      "error",
      "/dashboard",
      `Your ${tier} plan allows only ${limits.activeDeals} active deals. Upgrade to scan more.`,
    );
  }

  // Get the email account
  const { data: account, error: accountError } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single();

  if (accountError || !account || !account.access_token) {
    throw new Error("Email account not found or not connected");
  }

  try {
    // Fetch emails from Gmail API
    const gmailResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=from:(brand OR marketing OR collaboration OR sponsor OR partnership) OR subject:(brand OR collaboration OR sponsor OR partnership OR deal OR campaign)",
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      },
    );

    if (!gmailResponse.ok) {
      throw new Error(`Gmail API error: ${gmailResponse.statusText}`);
    }

    const gmailData = await gmailResponse.json();
    const messages = gmailData.messages || [];

    // Process up to 20 recent emails to avoid overwhelming the system
    const messagesToProcess = messages.slice(0, 20);

    for (const message of messagesToProcess) {
      try {
        // Get full message details
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          },
        );

        if (!messageResponse.ok) continue;

        if (
          limits.activeDeals !== -1 &&
          activeDealsCount >= limits.activeDeals
        ) {
          console.log("Deal limit reached - stopped scanning");
          break;
        }

        const messageData = await messageResponse.json();
        const headers = messageData.payload.headers;

        const subject =
          headers.find((h: any) => h.name === "Subject")?.value || "";
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        const date = headers.find((h: any) => h.name === "Date")?.value || "";

        // Extract email address from "Name <email@domain.com>" format
        const emailMatch =
          from.match(/<([^>]+)>/) || from.match(/([\w.-]+@[\w.-]+\.[\w]+)/);
        const senderEmail = emailMatch ? emailMatch[1] : from;

        // Extract brand name (simple heuristic)
        const brandName =
          from.split("<")[0].trim() || senderEmail.split("@")[0];

        // Get email body
        let emailBody = "";
        if (messageData.payload.body?.data) {
          emailBody = Buffer.from(
            messageData.payload.body.data,
            "base64",
          ).toString();
        } else if (messageData.payload.parts) {
          // Handle multipart messages
          const textPart = messageData.payload.parts.find(
            (part: any) =>
              part.mimeType === "text/plain" || part.mimeType === "text/html",
          );
          if (textPart?.body?.data) {
            emailBody = Buffer.from(textPart.body.data, "base64").toString();
          }
        }

        // Simple brand deal detection logic
        const brandKeywords = [
          "collaboration",
          "partnership",
          "sponsor",
          "brand deal",
          "campaign",
          "promote",
          "marketing",
          "influencer",
          "content creator",
          "ambassador",
          "review",
          "feature",
          "showcase",
          "compensation",
        ];

        const text = (subject + " " + emailBody).toLowerCase();
        const isBrandDeal = brandKeywords.some((keyword) =>
          text.includes(keyword),
        );

        if (!isBrandDeal) continue;

        // Extract offer amount (simple regex)
        const amountMatch = emailBody.match(/\$([0-9,]+(?:\.[0-9]{2})?)/g);
        let offerAmount = null;
        let currency = "USD";

        if (amountMatch && amountMatch.length > 0) {
          const amount = amountMatch[0].replace(/[$,]/g, "");
          offerAmount = parseFloat(amount);
        }

        // Check if this deal already exists
        const { data: existingDeal } = await supabase
          .from("brand_deals")
          .select("id")
          .eq("email_id", message.id)
          .eq("user_id", user.id)
          .single();

        if (existingDeal) continue; // Skip if already processed

        // Insert brand deal
        const { error: insertError } = await supabase
          .from("brand_deals")
          .insert({
            user_id: user.id,
            email_account_id: accountId,
            email_id: message.id,
            brand_name: brandName,
            sender_email: senderEmail,
            email_subject: subject,
            email_body: emailBody.substring(0, 5000), // Limit body length
            offer_amount: offerAmount,
            currency: currency,
            status: "pending",
            deadline: null, // Could be extracted with more sophisticated parsing
          });

        if (insertError) {
          console.log("Error inserting brand deal:", insertError);
        } else {
          activeDealsCount++;
        }
      } catch (messageError) {
        console.log("Error processing message:", messageError);
        continue;
      }
    }

    return { success: true, processed: messagesToProcess.length };
  } catch (error) {
    console.log("Error scanning emails:", error);
    throw error;
  }
};

export const getUserBrandDeals = async (userId: string) => {
  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from("brand_deals")
    .select(
      `
      *,
      email_accounts!inner(
        email_address,
        provider
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching brand deals:", error);
    return [];
  }

  return deals || [];
};

export const updateBrandDealStatus = async (dealId: string, status: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/dashboard", "User not authenticated");
  }

  const { error } = await supabase
    .from("brand_deals")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Failed to update deal status",
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Deal status updated successfully",
  );
};

export const removeBrandDeal = async (brandDealId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/dashboard", "User not authenticated");
  }

  // Delete brand deal
  const { error: brandDealError } = await supabase
    .from("brand_deals")
    .delete()
    .eq("id", brandDealId);

  if (brandDealError) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Failed to remove brand deal",
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Brand deal successfully removed",
  );
};
