# Mini CRM — Camesa

Aplicação web para cadastrar e acompanhar leads comerciais.
Projeto educacional do curso Vibe Coding — pratica o ciclo completo com Claude Code, Next.js, Supabase e Vercel.

---

## Visão geral

Interface simples de CRM com uma única entidade (`leads`) e pipeline de três estágios: **Novo → Em contato → Fechado**. O foco é demonstrar o loop de desenvolvimento assistido por IA: descrever → IA gera → commit → deploy.

Sem autenticação. Sem multi-tenant. Projetado para aprendizado, não para produção.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 14 (App Router, Server Components) |
| Linguagem | TypeScript 5 — modo estrito |
| UI | Tailwind CSS 3.4 |
| Banco | Supabase (Postgres) |
| Deploy | Vercel |
| Gerenciador | npm |

---

## Funcionalidades atuais

- **Listagem de leads** com busca em tempo real (nome, empresa, telefone, e-mail)
- **Filtro por status** via pills clicáveis com contagem — Todos / Novo / Em contato / Fechado
- **Estado vazio com ação** — quando a busca ou o filtro não retorna resultados, exibe mensagem contextual com botão para limpar busca ou voltar para "Todos"
- **Ordenação** por qualquer coluna (clique no header)
- **Cadastro e edição** de lead com máscara de telefone brasileiro
- **Exclusão** com dialog de confirmação
- **Banner de feedback** após criar, editar ou excluir
- **Cards de resumo** com totais por status no topo da listagem

---

## Estrutura do projeto

```text
src/
├── app/
│   ├── leads/
│   │   ├── page.tsx          # listagem + cards de resumo
│   │   ├── error.tsx         # error boundary
│   │   ├── new/page.tsx      # cadastro
│   │   └── [id]/page.tsx     # detalhe + edição + exclusão
│   ├── layout.tsx
│   └── page.tsx              # redirect para /leads
├── components/
│   ├── LeadForm.tsx          # formulário compartilhado (criar/editar)
│   ├── LeadTable.tsx         # tabela com filtros, busca e ordenação
│   ├── StatusBadge.tsx       # badge colorido por status
│   ├── SuccessBanner.tsx     # banner de feedback pós-ação
│   ├── ConfirmDialog.tsx     # modal de confirmação para exclusão
│   └── Navbar.tsx
└── lib/
    ├── actions.ts            # Server Actions (criar, editar, excluir)
    ├── leads.ts              # queries Supabase (server-only)
    ├── supabase.ts           # cliente Supabase singleton (server-only)
    ├── types.ts              # tipos de domínio (Lead, LeadStatus)
    ├── database.types.ts     # tipos do schema (mantido manualmente)
    └── utils.ts              # utilitários (formatPhone)

supabase/
└── migrations/               # 5 migrations incrementais
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com) com um projeto criado
- Tabela `leads` criada via migrations (ver seção abaixo)

### 1. Clone e instale

```bash
git clone https://github.com/camesati/mini-crm.git
cd mini-crm
npm install
```

### 2. Configure as variáveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>

# Opcional: service role key para bypassar RLS no servidor
# SUPABASE_SECRET_ROLE=<sua-service-role-key>
```

As chaves estão em **Supabase → Project Settings → API**.

### 3. Aplique as migrations

No SQL Editor do Supabase, execute os arquivos em ordem:

```text
supabase/migrations/001_create_leads.sql
supabase/migrations/002_simplify_status.sql
supabase/migrations/003_portuguese_status.sql
supabase/migrations/004_definitive_status.sql
supabase/migrations/005_add_email.sql
supabase/migrations/006_enable_rls.sql
```

### 4. Inicie o servidor

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## Banco de dados e RLS

### Schema atual (`leads`)

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | uuid | PK, `gen_random_uuid()` |
| `nome` | text | obrigatório |
| `empresa` | text | obrigatório |
| `contato` | text | telefone, nullable |
| `email` | text | nullable |
| `status` | text | `novo` \| `em_contato` \| `fechado` |
| `notas` | text | nullable |
| `created_at` | timestamptz | `now()` |

### Migrations

6 arquivos em `supabase/migrations/`, aplicados manualmente via SQL Editor do Supabase. Não há CLI do Supabase configurado neste projeto.

### RLS

RLS está **habilitada** desde a migration `006_enable_rls.sql`. As policies atuais são permissivas (`using (true)`) para o role `anon`, preservando o comportamento do projeto enquanto não há autenticação implementada.

O servidor usa a `SUPABASE_SECRET_ROLE` (service role key) quando disponível, que bypassa RLS automaticamente. Se essa variável não estiver configurada no Vercel, o app opera via anon key e as policies se aplicam normalmente — o comportamento atual é idêntico nos dois casos porque as policies permitem tudo.

> **Próximo passo de segurança:** quando autenticação for adicionada, substituir `to anon using (true)` por `to authenticated using (auth.uid() is not null)` em cada policy.

---

## Workflow de contribuição

Este projeto segue **Conventional Commits** e fluxo com PR — nunca commitar direto em `main`.

```bash
# 1. Crie uma branch
git checkout -b feat/descricao-curta

# 2. Faça as alterações e valide
npm run build
npm run lint

# 3. Commit
git commit -m "feat(escopo): descrição em até 72 caracteres"

# 4. Push e abra PR
git push origin feat/descricao-curta
```

Consulte `.claude/rules/mini-crm-frontend.md` para convenções de componentes e `.claude/skills/preparar-pr/` para automatizar a abertura do PR com Claude Code.

---

## Próximos passos

- [ ] Habilitar RLS e configurar policies por usuário autenticado
- [ ] Adicionar autenticação (Supabase Auth)
- [ ] Paginação na tabela (necessária acima de ~100 leads)
- [ ] Gerar `database.types.ts` automaticamente via `supabase gen types`
- [ ] Adicionar testes de integração (Playwright ou similar)
