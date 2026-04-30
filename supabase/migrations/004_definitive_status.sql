-- Migration definitiva: atualiza status para português
-- Executar no SQL Editor do Supabase

-- 1. Migra registros com valores antigos
update leads set status = 'novo'       where status in ('new');
update leads set status = 'em_contato' where status in ('contacted');
update leads set status = 'fechado'    where status in ('closed', 'won', 'lost', 'qualified', 'proposal');

-- 2. Atualiza o valor padrão da coluna
alter table leads alter column status set default 'novo';

-- 3. Recria o constraint com os valores definitivos em português
alter table leads drop constraint if exists leads_status_check;
alter table leads
  add constraint leads_status_check
  check (status in ('novo', 'em_contato', 'fechado'));
