import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./authService";

export async function saveSettingsToCloud(settings) {
  const user = await getCurrentUser();

  if (!user) return null;

  const { error } = await supabase
    .from("settings")
    .upsert(
      {
        user_id: user.id,
        auto_recovery: settings.autoRecovery,
        show_exact_energy: settings.showExactEnergy,
        auto_open_help: settings.autoOpenHelp,
        breathing_cycles: settings.breathingCycles,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  return error;
}

export async function loadSettingsFromCloud() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    autoRecovery: data.auto_recovery,
    showExactEnergy: data.show_exact_energy,
    autoOpenHelp: data.auto_open_help,
    breathingCycles: data.breathing_cycles,
  };
}