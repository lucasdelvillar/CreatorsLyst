import { handleGmailCallback } from "@/app/actions";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Gmail callback route: Start of Debug Session");
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  console.log("Callback parameters:", {
    hasCode: !!code,
    codeLength: code?.length || 0,
    state,
    error,
  });

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  // BUG FIX: added error check for when a user cancels when confirming if they want to connect their email account
  if (error === "access_denied") {
    console.log("User cancelled Gmail authorization");
    return Response.redirect(new URL("/dashboard", SITE_URL));
  }

  if (error) {
    console.log("Gmail OAuth error:", error);
    return Response.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Gmail connection was cancelled or failed")}`,
        SITE_URL,
      ),
    );
  }

  if (!code || !state) {
    console.log("Missing required parameters:", {
      code: !!code,
      state: !!state,
    });
    return Response.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Invalid callback parameters")}`,
        SITE_URL,
      ),
    );
  }

  console.log("Proceeding to handle Gmail callback");
  return await handleGmailCallback(code, state);
}
