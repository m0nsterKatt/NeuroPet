import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./authService";

export async function saveEnergyToCloud(energy) {
  const user = await getCurrentUser();

  if (!user) return null;

  const { error } = await supabase
    .from("energy_state")
    .upsert(
      {
        user_id: user.id,
        energy,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  return error;
}

export async function loadEnergyFromCloud() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("energy_state")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return null;

  return data?.energy ?? null;
}