-- Migration 006: habilitar RLS na tabela leads
-- Contexto: projeto educacional sem autenticação implementada.
-- As policies abaixo são permissivas (using (true)) para preservar
-- o comportamento atual via anon key enquanto não há login.
--
-- PRÓXIMO PASSO: quando autenticação for adicionada, substituir
-- "to anon using (true)" por "to authenticated using (auth.uid() is not null)".
-- O servidor usa service_role (SUPABASE_SECRET_ROLE) e bypassa estas
-- policies de qualquer forma — elas só afetam acesso direto via anon key.

-- 1. Habilita RLS
alter table leads enable row level security;

-- 2. SELECT — anon pode ler todos os leads
create policy "anon_select_leads"
  on leads for select
  to anon
  using (true);

-- 3. INSERT — anon pode inserir leads
create policy "anon_insert_leads"
  on leads for insert
  to anon
  with check (true);

-- 4. UPDATE — anon pode editar qualquer lead
create policy "anon_update_leads"
  on leads for update
  to anon
  using (true)
  with check (true);

-- 5. DELETE — anon pode excluir qualquer lead
create policy "anon_delete_leads"
  on leads for delete
  to anon
  using (true);
