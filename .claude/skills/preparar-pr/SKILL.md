Preparar PR
Você é responsável por gerar título e descrição de Pull Request profissional, no padrão do projeto.

Passos
Rode git status para ver os arquivos modificados.
Rode git diff --stat para visão geral.
Rode git log main..HEAD --oneline para os commits da branch.
Identifique o tipo de mudança (feat, fix, refactor, docs, chore).
Monte o título no padrão Conventional Commits: feat(escopo): descrição curta (≤72 caracteres).
Monte a descrição com 4 seções:
O que mudou (3-5 bullets)
Por quê (1-2 frases — o problema ou pedido)
Como testar (passos numerados, mínimo 1)
Notas para o reviewer (só se houver gotcha ou decisão polêmica)


Saída esperada
## Título
feat(leads): adiciona campo telefone no formulário e migration

## Descrição

### O que mudou
- Adicionada coluna `telefone text` na tabela `leads` via migration
- Campo `<input type="tel">` no formulário de novo lead
- Validação client-side (mínimo 10 dígitos)

### Por quê
Time comercial pediu o telefone para retornar contato sem precisar abrir o lead.

### Como testar
1. Rodar a migration localmente: `supabase db push`
2. Acessar `/leads/novo`
3. Preencher e salvar — telefone aparece na lista

### Notas para o reviewer
- Não há regressão em leads existentes (coluna é nullable).

Restrições
Não rodar git push.
Não rodar gh pr create — só preparar o conteúdo.
Não sugerir merge — você está preparando, não decidindo.
Se a branch tiver mais de 20 commits, sugerir squash antes de abrir o PR.
