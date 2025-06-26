import { handleGmailCallback } from "@/app/actions";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("gmail route.ts: Start of Debug Session");
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://hardcore-ptolemy9-9utwh.view-3.tempo-dev.app"; // TODO: add my public_site_url in config when deploying to own domain

  // BUG FIX: added error check for when a user cancels when confirming if they want to connect their email account
  if (error === "access_denied") {
    // User clicked "Cancel"
    return Response.redirect(new URL("/dashboard", SITE_URL));
  }

  if (error) {
    return Response.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Gmail connection was cancelled or failed")}`,
        SITE_URL,
      ),
    );
  }

  if (!code || !state) {
    return Response.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent("Invalid callback parameters")}`,
        SITE_URL,
      ),
    );
  }

  return await handleGmailCallback(code, state);
}
