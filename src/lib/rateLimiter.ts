import { createClient } from "@/supabase/client";

const userStore = new Map<string, UserRecord>();
const supabase = createClient();

async function syncWithDatabase(userId: string, count: number) {
  // Only sync every 5 minutes to reduce DB calls
  const lastSynced = userStore.get(userId)?.lastSynced || 0;
  if (Date.now() - lastSynced < 300_000) return;

  await supabase
    .from("rate_limits")
    .upsert({
      user_id: userId,
      count,
      last_updated: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

export async function checkRateLimit(userId: string, tier: Tier) {
  let record = userStore.get(userId);
  const today = new Date().toISOString().split("T")[0];

  if (!record || record.date !== today) {
    const { data } = await supabase
      .from("rate_limits")
      .select("count")
      .eq("user_id", userId)
      .single();

    record = {
      count: data?.count || 0,
      date: today,
      lastSynced: Date.now(),
    };
    userStore.set(userId, record);
  }

  record.count++;
  await syncWithDatabase(userId, record.count);

  return record.count <= TIERS[tier].dailyLimit;
}
