import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

export function initials(user: AuthUser | null): string {
  const source = user?.name?.trim() || user?.email?.trim() || "?";
  return source.charAt(0).toUpperCase();
}

/** Load the profile row for a signed-in user, falling back to auth metadata. */
export async function loadProfile(
  id: string,
  email: string,
  metaName?: string | null,
): Promise<AuthUser> {
  const { data } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", id)
    .maybeSingle();

  return {
    id,
    email: data?.email ?? email,
    name: data?.name ?? metaName ?? null,
  };
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signUpWithPassword(
  email: string,
  password: string,
  name: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { name },
    },
  });
  if (error) throw new Error(error.message);
  return { needsConfirmation: !data.session };
}

export async function signOutRequest() {
  await supabase.auth.signOut();
}
