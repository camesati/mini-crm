// Schema real da tabela leads no Supabase
// Colunas: id, nome, empresa, contato, email, status, notas, created_at
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          nome: string;
          empresa: string;
          contato: string;
          email: string;
          status: string;
          notas: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          empresa?: string | null;
          contato?: string | null;
          email?: string | null;
          status?: string | null;
          notas?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          nome?: string | null;
          empresa?: string | null;
          contato?: string | null;
          email?: string | null;
          status?: string | null;
          notas?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
