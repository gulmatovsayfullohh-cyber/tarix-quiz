import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// Admin operatsiyalari uchun service_role bilan ishlaydi
export const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
