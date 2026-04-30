import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Criação lazy para não falhar durante `next build` sem .env.local
let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    _client = createClient<Database>(url, key);
  }
  return _client;
}
