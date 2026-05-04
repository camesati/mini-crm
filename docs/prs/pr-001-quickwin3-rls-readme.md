# PR-001 — feat(leads): contagem por status nas pills, RLS habilitada e README

> Simulação gerada via skill `preparar-pr` · Sessão 1 · 04/05/2026

---

## Metadados

| Campo | Valor |
| --- | --- |
| Título | `feat(leads): contagem por status nas pills, RLS habilitada e README` |
| Branch simulada | `main` (commits `d73cc02` → `b93ed0f`) |
| Base | `f8bd24a` |
| Autor | Leandro |
| Data | 04/05/2026 |
| Status | Simulado — PR não aberto |

---

## Commits incluídos

| Hash | Mensagem |
| --- | --- |
| `d73cc02` | feat(leads): contagem de leads por status nas pills de filtro |
| `c231ba9` | docs: substituir README boilerplate por documentação real do projeto |
| `b93ed0f` | security: habilitar RLS na tabela leads com policies abertas para anon |

---

## Diff resumido

```
src/components/LeadTable.tsx           |   8 ++
README.md                              | 184 +++++++++++++++++++++----
supabase/RLS.md                        | 124 ++++++++++++++++++++++
supabase/migrations/006_enable_rls.sql |  37 +++++++
4 files changed, 333 insertions(+), 20 deletions(-)
```

---

## O que mudou

- `src/components/LeadTable.tsx`: `useMemo` computa contagem por status a partir do prop `leads`; cada pill exibe `(n)` — ex: "Novo (2) · Em contato (2) · Fechado (1)"
- `supabase/migrations/006_enable_rls.sql`: habilita RLS na tabela `leads` e cria 4 policies permissivas para role `anon` (select, insert, update, delete)
- `supabase/RLS.md`: novo documento — estado atual de RLS, design do cliente Supabase (service_role bypassa policies), tabela de policies e roteiro SQL para quando autenticação for implementada
- `README.md`: substitui boilerplate do `create-next-app` por documentação real — stack, setup local, schema do banco, migrations, workflow de contribuição e próximos passos

---

## Por quê

Encerra a sessão com três entregas complementares: uma quickwin de produto (contagem visível nas pills), uma melhoria de segurança auditável (RLS formalmente habilitada com migration versionada) e documentação fiel ao que realmente existe no repositório.

---

## Como testar

1. Abrir `/leads` — verificar que as pills exibem contagem: **Todos (n) · Novo (n) · Em contato (n) · Fechado (n)**
2. Criar um novo lead com status "Novo" → após redirect, confirmar que a pill **Novo** incrementou em 1
3. Clicar em cada pill e confirmar que o filtro continua funcionando (regressão da quickwin 2)
4. No **Supabase Dashboard → SQL Editor**, executar o conteúdo de `supabase/migrations/006_enable_rls.sql` e verificar em **Authentication → Policies** que as 4 policies aparecem na tabela `leads`
5. Conferir o README no GitHub — deve conter as seções: visão geral, stack, funcionalidades, setup local, banco/RLS, workflow e próximos passos

---

## Notas para o reviewer

- A migration 006 **não quebra o app** — o servidor usa `SUPABASE_SECRET_ROLE` (service_role) que bypassa RLS; a mudança só afeta acesso direto via anon key pela API REST pública do Supabase
- As policies `using (true)` são intencionais para esta fase sem autenticação; `supabase/RLS.md` documenta o SQL exato para substituí-las por `to authenticated` quando login for implementado
- A migration precisa ser **aplicada manualmente** no SQL Editor do Supabase — não há CLI configurado no projeto
- Pré-requisito já em `main`: `f8bd24a` (fix SuccessBanner → Server Component)
