-- Migra todos os status antigos para os novos valores em português
update leads set status = 'novo'       where status in ('new');
update leads set status = 'em_contato' where status in ('contacted');
update leads set status = 'fechado'    where status in ('closed', 'won', 'lost', 'qualified', 'proposal');

-- Atualiza o default da coluna
alter table leads alter column status set default 'novo';

-- Recria o constraint com os valores em português
alter table leads drop constraint if exists leads_status_check;
alter table leads
  add constraint leads_status_check
  check (status in ('novo', 'em_contato', 'fechado'));
