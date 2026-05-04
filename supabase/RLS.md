# Estado de RLS — mini-crm

> Documento de referência para decisões de segurança no banco de dados.
> Atualizar sempre que uma migration de policy for aplicada.

---

## Estado atual

| Tabela | RLS habilitada | Policies |
| --- | --- | --- |
| `leads` | ⏳ Pendente aplicação da migration `006` | 4 policies abertas prontas para aplicar |

---

## Histórico de migrations de segurança

| Migration | Conteúdo de segurança |
| --- | --- |
| `001_create_leads.sql` | RLS **desabilitada** — comentário explícito "desativado por padrão para prototipagem" |
| `002` a `005` | Sem alterações de RLS — apenas schema e dados |
| `006_enable_rls.sql` | **Habilita RLS** + cria 4 policies permissivas para role `anon` |

---

## Como o app acessa o banco

O servidor Next.js usa a **service role key** (`SUPABASE_SECRET_ROLE`) quando disponível,
caindo de volta para a anon key se a variável não estiver definida:

```ts
// src/lib/supabase.ts
const key = process.env.SUPABASE_SECRET_ROLE ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

| Chave usada | Efeito sobre RLS |
| --- | --- |
| `service_role` | **Bypassa todas as policies** — acesso irrestrito ao banco |
| `anon` | Sujeito às policies configuradas |

O módulo tem `import 'server-only'` — a service role key nunca chega ao browser.

---

## Policies definidas em `006_enable_rls.sql`

> Fase atual: educacional, sem autenticação. Policies permissivas para role `anon`.

| Policy | Operação | Role | Condição |
| --- | --- | --- | --- |
| `anon_select_leads` | SELECT | anon | `using (true)` — lê tudo |
| `anon_insert_leads` | INSERT | anon | `with check (true)` — insere qualquer linha |
| `anon_update_leads` | UPDATE | anon | `using (true)` — edita qualquer linha |
| `anon_delete_leads` | DELETE | anon | `using (true)` — exclui qualquer linha |

**Efeito prático com a migration 006 aplicada:**
- O servidor (service_role) continua funcionando sem alteração
- Acesso direto à API REST do Supabase via anon key continua permitido
- A diferença é que agora há RLS habilitada e as regras estão **explícitas e auditáveis**

---

## Como aplicar a migration

No **SQL Editor do Supabase** (Dashboard → SQL Editor → New query):

```sql
-- Cole o conteúdo de supabase/migrations/006_enable_rls.sql aqui
-- e execute com Run (Ctrl+Enter)
```

Confirme no Dashboard → Authentication → Policies que a tabela `leads` aparece
com as 4 policies listadas acima.

---

## Quando autenticação for implementada

Substituir as policies atuais por versões restritas a usuários autenticados:

```sql
-- Remover policies abertas
drop policy if exists "anon_select_leads" on leads;
drop policy if exists "anon_insert_leads" on leads;
drop policy if exists "anon_update_leads" on leads;
drop policy if exists "anon_delete_leads" on leads;

-- Criar policies para usuários autenticados
create policy "auth_select_leads"
  on leads for select
  to authenticated
  using (auth.uid() is not null);

create policy "auth_insert_leads"
  on leads for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "auth_update_leads"
  on leads for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "auth_delete_leads"
  on leads for delete
  to authenticated
  using (auth.uid() is not null);
```

> Para multi-tenant (cada usuário vê só seus leads), adicionar coluna `user_id uuid references auth.users`
> e trocar `auth.uid() is not null` por `user_id = auth.uid()`.

---

## Checklist de segurança atual

- [x] `supabase.ts` usa `server-only` — service role key não vaza para o browser
- [x] `.env.local` nunca foi commitado (verificado via `git log --all -- .env.local`)
- [x] Anon key em `.env` (pública) não tem acesso privilegiado
- [ ] **Migration 006 ainda não aplicada no Supabase** — aplicar manualmente via SQL Editor
- [ ] RLS habilitada no banco (pendente aplicação da migration)
- [ ] Autenticação não implementada
- [ ] Policies de auth (`to authenticated`) não existem
