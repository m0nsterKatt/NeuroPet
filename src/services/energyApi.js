import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./authService";

export async function loadEnergyStateFromCloud() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("energy_state")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error cargando energía:", error);
    return null;
  }

  return data;
}

export async function saveEnergyStateToCloud(energy, lastRecoveryAt = null) {
  const user = await getCurrentUser();
  if (!user) return null;

  const payload = {
    user_id: user.id,
    energy,
    updated_at: new Date().toISOString(),
  };

  if (lastRecoveryAt) {
    payload.last_recovery_at = lastRecoveryAt;
  }

  const { error } = await supabase
    .from("energy_state")
    .upsert(payload, {
      onConflict: "user_id",
    });

  if (error) {
    console.error("Error guardando energía:", error);
  }

  return error;
}