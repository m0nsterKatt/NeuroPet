import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./authService";

export async function saveLogToCloud(log) {
  const user = await getCurrentUser();

  if (!user) return null;

  const { error } = await supabase
    .from("activity_logs")
    .insert({
        user_id: user.id,
        category: log.category,
        activity: log.activity,
        emoji: log.emoji,
        duration: log.duration,
        impact: log.impact,
        date: log.date,
    });

  return error;
}

export async function loadLogsFromCloud() {
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];

  return data;
}

export async function clearLogsFromCloud() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { error } = await supabase
    .from("activity_logs")
    .delete()
    .eq("user_id", user.id);

  return error;
}