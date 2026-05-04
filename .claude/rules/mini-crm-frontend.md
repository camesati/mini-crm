Frontend do Mini-CRM
Princípios
App Router do Next.js 14 — não regredir para Pages Router.
Componentes pequenos e focados, com 1 responsabilidade clara.
Server Components por padrão; Client Components só quando precisar de estado/interação.
TypeScript estrito — proibido any, evitar as quando puder tipar.

Domínio
Status válidos de lead: novo, em_contato, fechado — nunca inventar outros.
Campos obrigatórios: nome, empresa.
Campos opcionais: contato (telefone do lead), notas.

UI/UX
Manter coerência com a paleta já existente (não introduzir nova cor sem confirmar).
Acessibilidade básica: aria-label em ícones-puros, htmlFor em labels, <button> em vez de <div onClick>.
Formulários: feedback de loading e erro visíveis.
Tabela de leads: paginação ou virtualização se a lista passar de 100 itens.

Stack
Tailwind CSS preferido — utilitários inline ok, evitar CSS-in-JS.
Sem bibliotecas pesadas (Material-UI, Antd) — manter o bundle leve.
Anti-padrões
❌ useEffect para buscar dados em Server Component (use fetch direto).
❌ useState global para algo que cabe em URL search params.
❌ Componentes com mais de 150 linhas — extrair pedaços.
❌ Tipo any em props.