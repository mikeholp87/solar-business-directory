type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

type SupabaseAdminEnv = {
  url: string;
  serviceRoleKey: string;
};

type SignupEnv = {
  adminInviteCode: string | null;
};

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function hasSupabasePublicEnv() {
  return Boolean(readEnv("NEXT_PUBLIC_SUPABASE_URL") && readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }

  return { url, anonKey };
}

export function getSupabaseAdminEnv(): SupabaseAdminEnv | null {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

export function getSignupEnv(): SignupEnv {
  return {
    adminInviteCode: readEnv("ADMIN_SIGNUP_INVITE_CODE")
  };
}
