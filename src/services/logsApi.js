import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./authService";

export async function saveLogToCloud(log) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: user.id,
      category: log.category,
      activity: log.activity,
      emoji: log.emoji,
      duration: log.duration,
      impact: log.impact,
      date: log.date,
    })
    .select()
    .single();

  if (error) {
    console.error("Error guardando log:", error);
    return null;
  }

  return data;
}

export async function loadLogsFromCloud() {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando logs:", error);
    return [];
  }

  return data;
}

export async function clearLogsFromCloud() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { error } = await supabase
    .from("activity_logs")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error borrando logs:", error);
  }

  return error;
}