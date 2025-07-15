import { createClient } from "../../supabase/server";

type UserRecord = {
  count: number;
  date: string;
  lastSynced: number;
};

type Tier = "starter" | "pro" | "studio";

const TIERS = {
  starter: { dailyLimit: 5 },
  pro: { dailyLimit: 10 },
  studio: { dailyLimit: 20 },
};

//const userStore = new Map<string, UserRecord>(); NOTE: commented out in-memory caching for testing purposes

async function syncWithDatabase(userId: string, count: number, date: string) {
  //NOTE: commented out in-memory caching for testing purposes
  // Only sync every 5 minutes to reduce DB calls
  //const lastSynced = userStore.get(userId)?.lastSynced || 0;
  //if (Date.now() - lastSynced < 300_000) return;

  const supabase = await createClient();
  await supabase
    .from("rate_limits")
    .upsert({
      user_id: userId,
      count,
      date,
      last_updated: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("date", date);
}

export async function checkRateLimit(userId: string, tier: Tier) {
  // NOTE: commented out in-memory caching for testing purposes.
  //let record = userStore.get(userId);
  const today = new Date().toISOString().split("T")[0];

  // if (!record || record.date !== today) {
  //   const supabase = await createClient();
  //   const { data } = await supabase
  //     .from("rate_limits")
  //     .select("count")
  //     .eq("user_id", userId)
  //     .eq("date", today)
  //     .single();

  //   record = {
  //     count: data?.count || 0,
  //     date: today,
  //     lastSynced: Date.now(),
  //   };
  //   userStore.set(userId, record);
  // }

  const supabase = await createClient();
  const { data } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  let record = {
    count: data?.count || 0,
    date: today,
    lastSynced: Date.now(),
  };

  record.count++;
  await syncWithDatabase(userId, record.count, today);

  return {
    allowed: record.count <= TIERS[tier].dailyLimit,
    count: record.count,
    limit: TIERS[tier].dailyLimit,
  };
}
