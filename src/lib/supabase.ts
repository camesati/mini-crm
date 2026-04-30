import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Usa service role (server-only) para operações de banco; bypassa RLS
    const key = process.env.SUPABASE_SECRET_ROLE ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        'Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_ROLE ' +
        'no .env.local (dev) ou nas variáveis de ambiente da Vercel (prod).',
      );
    }

    _client = createClient<Database>(url, key, {
      auth: { persistSession: false },
    });
  }
  return _client;
}
