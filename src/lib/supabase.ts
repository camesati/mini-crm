import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        'Variáveis de ambiente não configuradas. ' +
        'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'no painel da Vercel (ou no arquivo .env.local).',
      );
    }

    _client = createClient<Database>(url, key);
  }
  return _client;
}
