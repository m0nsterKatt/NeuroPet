import { supabase } from "./supabaseClient";

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { data: null, error };
  }

  const user = data.user;

  if (user) {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        username,
      },
      {
        onConflict: "id",
      }
    );
  }

  return { data, error: null };
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return { data, error };
}

export async function createProfileIfMissing(userId, username) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        username,
      },
      {
        onConflict: "id",
      }
    )
    .select()
    .maybeSingle();

  return { data, error };
}