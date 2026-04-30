create table if not exists leads (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  phone      text        not null default '',
  company    text        not null default '',
  status     text        not null default 'new'
               check (status in ('new','contacted','qualified','proposal','won','lost')),
  notes      text        not null default '',
  created_at timestamptz not null default now()
);

-- Index para ordenação padrão (created_at DESC)
create index if not exists leads_created_at_idx on leads (created_at desc);

-- RLS: desativado por padrão para prototipagem.
-- Em produção, habilite RLS e adicione políticas adequadas:
--   alter table leads enable row level security;
--   create policy "acesso total para usuários autenticados"
--     on leads for all using (auth.role() = 'authenticated');
