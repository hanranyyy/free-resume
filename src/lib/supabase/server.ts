import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 服务端 Supabase 客户端（Route Handler / Server Action 中使用）
 * 使用 Service Role Key，会绕过 RLS，请仅在受信任的服务端环境调用。
 */
let cachedClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase 环境变量未配置：请在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}