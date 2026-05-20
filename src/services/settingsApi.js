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

        auto_recovery:
          settings.autoRecovery,

        show_exact_energy:
          settings.showExactEnergy,

        auto_open_help:
          settings.autoOpenHelp,

        breathing_cycles:
          settings.breathingCycles,

        dark_mode:
          settings.darkMode,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    console.error(
      "Error guardando settings:",
      error
    );
  }

  return error;
}

export async function loadSettingsFromCloud() {
  const user = await getCurrentUser();

  if (!user) {
    return getDefaultSettings();
  }

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return getDefaultSettings();
  }

  return {
    autoRecovery:
      data.auto_recovery,

    showExactEnergy:
      data.show_exact_energy,

    autoOpenHelp:
      data.auto_open_help,

    breathingCycles:
      data.breathing_cycles,

    darkMode:
      data.dark_mode ?? false,
  };
}

export function getDefaultSettings() {
  return {
    autoRecovery: false,
    showExactEnergy: true,
    autoOpenHelp: false,
    breathingCycles: 5,
    darkMode: false,
  };
}