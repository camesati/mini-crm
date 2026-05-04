# Overview do Projeto — Mini CRM

**Aluno:** Leandro  
**Data:** 04/05/2026  
**Repositório:** `mini-crm-camesa` · branch `main`

---

## 1. Resumo executivo

O Mini CRM é uma aplicação web educacional construída no curso Vibe Coding para praticar o loop completo de desenvolvimento com Claude Code: descrever → IA gera → commit → deploy. O produto permite cadastrar e acompanhar leads comerciais com status de pipeline.

**Estágio atual:** CRUD completo funcionando em produção (Vercel). A estrutura de código, banco e Claude Code está sólida. A sessão de hoje foi inteiramente dedicada a quickwins — pequenas melhorias de UX e produto implementadas com Claude Code sobre a base já validada.

**Foco da sessão:** Três quickwins de produto (campo email, máscara de telefone + filtros de status + banner de sucesso, contagem nas pills) mais uma correção de bug introduzida durante as quickwins.

---

## 2. Stack identificada

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14.2.35 (App Router, Server Components) |
| Linguagem | TypeScript 5 — modo estrito ligado em `tsconfig.json` |
| UI/CSS | Tailwind CSS 3.4 — utilitários inline, sem CSS-in-JS |
| Banco de dados | Supabase (Postgres + RLS) via `@supabase/supabase-js` 2.105.1 |
| Deploy | Vercel (configuração mínima em `next.config.mjs`) |
| Controle de versão | Git + GitHub (`camesati/mini-crm`) |
| Runtime guard | `server-only` para proteger módulos server-side |

Sem bibliotecas de UI pesadas. Sem sistema de testes. Sem MCP configurado.

---

## 3. Estado atual do produto

### O que já funciona

- **Listagem de leads** (`/leads`) com tabela completa: nome (com avatar gerado), empresa, telefone formatado, e-mail, status colorido, data de criação
- **Filtros de status** por pills clicáveis: Todos / Novo / Em contato / Fechado — cada pill exibe a contagem atual (ex: "Novo (2)")
- **Busca em tempo real** por nome, empresa, telefone ou e-mail
- **Ordenação** por qualquer coluna com clique no header (toggle asc/desc)
- **Cadastro de lead** (`/leads/new`) com validação de campos obrigatórios e máscara de telefone aplicada durante a digitação
- **Edição de lead** (`/leads/[id]?edit=1`) via mesmo formulário
- **Exclusão de lead** com dialog de confirmação (`ConfirmDialog`)
- **Banner de sucesso** server-rendered após criar, editar ou excluir lead (via `?success=created|updated|deleted` na URL)
- **Cards de resumo** no topo da listagem: Total, Novos, Em contato, Fechados
- **Error boundary** em `/leads/error.tsx` para capturar falhas de carregamento
- **Navbar** fixa com link para Leads e botão Novo Lead

### O que está parcial

- **RLS:** habilitada no banco segundo as migrations, mas `supabase.ts` usa `SUPABASE_SECRET_ROLE ?? NEXT_PUBLIC_SUPABASE_ANON_KEY` — se `SUPABASE_SECRET_ROLE` não estiver definida nas variáveis do Vercel, o cliente opera com a anon key, potencialmente sujeito às policies RLS em vez de as contornar como o design indica
- **`database.types.ts`:** escrito manualmente (não gerado via `supabase gen types`) — tipos precisam ser mantidos sincronizados manualmente com o schema real

### O que ainda não existe

- Autenticação de usuário (sem login, sem controle de acesso por usuário)
- Paginação (a regra em `.claude/rules/` menciona virtualização acima de 100 itens — não implementada)
- Testes automatizados (unitários ou e2e)
- Upload de arquivos ou imagens de lead
- Histórico de atividades por lead
- MCP integrations (`.mcp.json` não existe)

### Fluxo principal do usuário hoje

`/leads` → ver lista com cards de resumo → filtrar por status ou buscar → clicar "Novo Lead" → preencher formulário com máscara de telefone → salvar → redirect para `/leads?success=created` com banner de confirmação → repetir

---

## 4. O que foi implementado nesta sessão

### Quickwin 1 — Campo de e-mail nos leads
- Nova coluna `email` (text, nullable) via `supabase/migrations/005_add_email.sql`
- `database.types.ts`, `types.ts`, `leads.ts` (toModel, createLead, updateLead) e `actions.ts` atualizados
- `LeadForm.tsx`: campo E-mail ao lado de Telefone
- `LeadTable.tsx`: coluna E-mail visível em telas `lg+`, incluída na busca
- `leads/[id]/page.tsx`: E-mail exibido na visualização do lead

### Quickwin 2 — Máscara de telefone + filtro por pills + banner de sucesso
- `src/lib/utils.ts`: função `formatPhone` (máscara brasileira celular/fixo, sem biblioteca)
- `LeadForm.tsx`: input de telefone como controlled component com `formatPhone` no onChange
- `LeadTable.tsx`: pills de filtro por status (Todos / Novo / Em contato / Fechado) com estado `statusFilter`; `formatPhone` aplicada na exibição do telefone na tabela; coluna renomeada de "Contato" para "Telefone"
- `src/components/SuccessBanner.tsx` (novo): banner de feedback após CRUD
- `src/lib/actions.ts`: redirects atualizados para incluir `?success=created|updated|deleted`
- `src/app/leads/page.tsx` e `src/app/leads/[id]/page.tsx`: leitura de `searchParams.success` e uso do banner

### Correção — Bug "a[e] is not a function"
- **Problema:** `SuccessBanner` foi criado como `'use client'` com `useState`, causando erro de hidratação no browser após redirect pós-criação de lead
- **Correção (`f8bd24a`):** removido `'use client'` e `useState`; componente convertido para Server Component puro — banner renderiza diretamente pelo prop `message`, sem estado no cliente; botão de fechar removido

### Quickwin 3 — Contagem de leads por status nas pills
- `LeadTable.tsx`: `useMemo` que computa contagens por status (`all`, `novo`, `em_contato`, `fechado`) a partir do prop `leads`; `<span>` com `(n)` adicionado inline em cada pill
- Resultado visual: "Todos (5) · Novo (2) · Em contato (2) · Fechado (1)"

---

## 5. Estrutura Claude Code no projeto

### CLAUDE.md
Presente em `c:\Users\Leandro\Desktop\mini-crm-camesa\CLAUDE.md`. Conteúdo abrangente e bem estruturado:
- Objetivo do projeto, stack, schema do banco, convenções de código (naming, TypeScript, commits/PRs), comandos úteis, anti-padrões, lista de arquivos protegidos e fontes de contexto extra. **Qualidade: alta.**

### .claude/settings.json
```json
{
  "includeCoAuthoredBy": false,
  "permissions": {
    "defaultMode": "plan",
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git branch*)"
    ]
  }
}
```
`defaultMode: plan` ativo — Claude pede aprovação antes de executar a maioria das ações. Permissões liberadas apenas para leitura e build.

### Rules
- `.claude/rules/mini-crm-frontend.md` — Presente. Cobre: App Router, Server Components por padrão, TypeScript estrito, status válidos do domínio, acessibilidade básica, Tailwind, anti-padrões de formulário e tabela. **Qualidade: boa e aderente ao projeto real.**

### Skills
- `.claude/skills/preparar-pr/SKILL.md` — Presente. Automatiza abertura de PR com template (summary, test plan) seguindo o workflow do projeto. **Não foi usada nesta sessão** (commits diretos em main).

### Subagentes
- `.claude/agents/auditor-mini-crm.md` — Presente. Audita docs, workflow, migrations, convenções de código e segurança RLS. **Não foi invocado nesta sessão.**

### .mcp.json
**Não existe.** Nenhuma integração MCP configurada no projeto.

### Qualidade geral da configuração
Boa para um projeto educacional. CLAUDE.md e rules estão alinhados com o código real. A skill de PR existe mas não foi exercitada. O `defaultMode: plan` é adequado para um contexto de aprendizado.

---

## 6. Banco, migrations e RLS

### Tabelas identificadas
- `leads` — única tabela; colunas: `id` (uuid PK), `nome` (text, obrigatório), `empresa` (text, obrigatório), `contato` (text, nullable — telefone), `email` (text, nullable), `status` (text: novo|em_contato|fechado), `notas` (text, nullable), `created_at` (timestamptz, default now())

### Migrations encontradas
| Arquivo | Conteúdo aparente |
|---|---|
| `001_create_leads.sql` | Criação da tabela `leads` + RLS inicial |
| `002_simplify_status.sql` | Simplificação do status |
| `003_portuguese_status.sql` | Status migrado para valores em português |
| `004_definitive_status.sql` | Consolidação definitiva do status (novo, em_contato, fechado) |
| `005_add_email.sql` | `ALTER TABLE leads ADD COLUMN email text` |

5 migrations incrementais, sequenciais e com nomes descritivos. Histórico de evolução do schema rastreável.

### Estado aparente do RLS
RLS está habilitada segundo `CLAUDE.md` e as migrations. O cliente Supabase em `src/lib/supabase.ts` usa `SUPABASE_SECRET_ROLE ?? NEXT_PUBLIC_SUPABASE_ANON_KEY`: se a variável de ambiente `SUPABASE_SECRET_ROLE` (service role key) não estiver configurada na Vercel, o app opera com a anon key e as policies RLS se aplicam normalmente. Não foi possível verificar o conteúdo exato das policies RLS nas migrations sem acesso ao Supabase dashboard.

### Riscos ou lacunas
- `database.types.ts` é mantido manualmente — risco de drift com o schema real do Supabase
- Sem `supabase gen types` configurado no workflow
- Não há seed de dados para desenvolvimento local

### Integração com Supabase
Cliente singleton em `src/lib/supabase.ts` com `persistSession: false` (correto para server-side). Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` presentes em `.env`. `SUPABASE_SECRET_ROLE` não confirmada no repositório.

---

## 7. Qualidade e riscos

### Pontos fortes
- TypeScript estrito sem `any` no código de feature
- Server Components por padrão — arquitetura correta para Next.js 14
- `server-only` importado em `supabase.ts` e `leads.ts` — protege vazamento de credenciais para o cliente
- Conventional Commits em todos os 10 commits visíveis
- CLAUDE.md e rules alinhados com o código real
- Funções de domínio isoladas em `src/lib/leads.ts` (sem lógica de negócio nos componentes)
- Build de produção passa sem erros ou warnings TypeScript

### Problemas técnicos encontrados
- **Bug de hidratação no SuccessBanner** (introduzido e corrigido na sessão): componente cliente com `useState` em posição de Server Component causou erro "a[e] is not a function" no browser após redirect — corrigido convertendo para Server Component puro
- **Build corrompido durante debugging:** execução de `npm run build` com dev server ativo corrompeu `.next/` — resolvido com `rm -rf .next && npm run build`
- `database.types.ts` mantido manualmente sem geração automática

### Problemas de UX/UI
- Banner de sucesso não tem botão de fechar (removido na correção para simplificar) — o banner desaparece ao navegar para outra URL, mas persiste se o usuário não sair da página
- Não há feedback de loading visual global durante navegações (o formulário tem spinner local)
- Em mobile, as colunas Empresa, Telefone, E-mail e Data somem — a tabela fica esparsa

### Riscos para continuidade
- **Commits diretos em main** nesta sessão: CLAUDE.md proíbe isso explicitamente. A skill `preparar-pr` não foi exercitada
- `SUPABASE_SECRET_ROLE` não confirmada em produção — se ausente, RLS protege o banco mas bypasse não funciona como esperado
- Sem testes: qualquer refatoração futura é feita sem rede de segurança

---

## 8. Próximos passos recomendados

### 3 imediatos
1. **Exercitar o workflow de PR:** criar uma branch, usar a skill `preparar-pr`, abrir PR no GitHub e fazer merge — para validar o ciclo completo que o CLAUDE.md exige
2. **Confirmar `SUPABASE_SECRET_ROLE` na Vercel:** verificar nas variáveis de ambiente do projeto Vercel se a service role key está configurada; se não, o RLS pode estar se comportando diferente do esperado
3. **Verificar o banner de sucesso em produção** (Vercel) após o deploy automático do push — confirmar que o erro "a[e] is not a function" não aparece mais

### 3 de curto prazo
1. **Gerar `database.types.ts` automaticamente** via `supabase gen types typescript --local > src/lib/database.types.ts` e adicionar ao workflow para evitar drift
2. **Paginação na tabela de leads** — já mencionada nas rules como necessária acima de 100 itens; implementar com `limit/offset` no Supabase ou URL search params
3. **Autenticação básica** — Supabase Auth (email/password) para proteger o app; atualmente qualquer pessoa com a URL tem acesso

### O que eu faria nos próximos 30 minutos se fosse continuar agora
Abrir o fluxo de PR completo: criar branch `feat/exercicio-pr`, fazer uma pequena melhoria (ex: página 404 customizada ou loading state global), usar a skill `preparar-pr` para abrir o PR, revisar, fazer merge — para o aluno experimentar o ciclo real que o projeto foi desenhado para ensinar.

---

## 9. Checklist de validação manual

### O que testar hoje
- [ ] `/leads` carrega sem erro — tabela com dados, cards de resumo, pills com contagem
- [ ] Pills de status filtram corretamente: clicar "Novo (n)" mostra só leads com status novo
- [ ] Busca filtra por nome, empresa, telefone e e-mail simultaneamente
- [ ] Ordenação por coluna: clicar "Nome" ordena A→Z, clicar de novo Z→A
- [ ] `/leads/new` → preencher formulário → criar lead → banner "Lead criado com sucesso!" aparece → contagem nas pills incrementa
- [ ] `/leads/[id]` → editar lead → banner "Lead atualizado com sucesso!" aparece
- [ ] `/leads/[id]` → excluir lead via dialog → redirect com banner "Lead excluído com sucesso."
- [ ] Máscara de telefone: digitar `11933334444` → campo exibe `(11) 93333-4444`
- [ ] Campo e-mail salva e exibe corretamente

### O que o instrutor deve verificar rapidamente
- Abrir o repositório no GitHub e confirmar os 10+ commits com mensagens padronizadas
- Verificar Vercel dashboard: deploy do último push (`d73cc02`) foi bem-sucedido
- Abrir o app em produção e criar um lead — confirmar que o banner funciona sem erro no browser

---

## 10. Status final

| Item | Status |
|---|---|
| Pronto para continuar aula? | **Sim** |
| Pronto para commit/push? | **Sim** — último commit `d73cc02` já em main |
| Principal bloqueador atual | Nenhum bloqueador técnico. Pendência de processo: workflow de PR não foi exercitado nesta sessão (commits diretos em main). |
