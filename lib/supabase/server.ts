export const supabaseMissingMessage = "尚未設定 Supabase，請先設定資料庫連線。";
export const supabaseSchemaMissingMessage = "Supabase 資料表尚未建立，請先執行 supabase/schema.sql。";
export const supabaseBucketMissingMessage = "Supabase Storage bucket 尚未建立，請建立 product-images 與 site-images。";

export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  configured: boolean;
};

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return {
    url,
    anonKey,
    serviceRoleKey,
    configured: Boolean(url && anonKey && serviceRoleKey)
  };
}

export function getMissingSupabaseEnvVars(): string[] {
  const envVars: Array<[string, string | undefined]> = [
    ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ["SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY]
  ];

  return envVars.filter(([, value]) => !value).map(([key]) => key);
}

export function getSupabaseStatus() {
  const config = getSupabaseConfig();
  const missingEnvVars = getMissingSupabaseEnvVars();
  return {
    configured: config.configured,
    requiresSupabase: process.env.NODE_ENV === "production",
    missingEnvVars,
    message:
      !config.configured && process.env.NODE_ENV === "production"
        ? `${supabaseMissingMessage} 缺少環境變數：${missingEnvVars.join("、")}`
        : ""
  };
}

export function getSupabaseRestHeaders() {
  const config = getSupabaseConfig();

  if (!config.configured) {
    throw new Error(supabaseMissingMessage);
  }

  return {
    config,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json"
    }
  };
}

export function normalizeSupabaseError(status: number, detail: string) {
  const lowerDetail = detail.toLowerCase();

  if (status === 404 || lowerDetail.includes("could not find") || lowerDetail.includes("does not exist")) {
    return supabaseSchemaMissingMessage;
  }

  return detail || `Supabase 操作失敗：${status}`;
}
