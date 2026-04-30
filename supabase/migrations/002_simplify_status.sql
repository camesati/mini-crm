-- Migra registros antigos para os 3 novos status
update leads set status = 'contacted' where status in ('qualified', 'proposal');
update leads set status = 'closed'    where status in ('won', 'lost');

-- Recria o constraint com os 3 valores
alter table leads drop constraint if exists leads_status_check;
alter table leads
  add constraint leads_status_check
  check (status in ('new', 'contacted', 'closed'));
