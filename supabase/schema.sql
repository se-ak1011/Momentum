-- Momentum Supabase schema
-- Run this in the Supabase SQL editor to set up the database.
-- Row Level Security (RLS) is enabled on all tables.

-- ============================================================
-- Clients
-- ============================================================
create table if not exists public.clients (
  id              uuid primary key default gen_random_uuid(),
  provider_id     uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  email           text not null,
  status          text not null default 'active' check (status in ('active', 'archived')),
  onboarding_stage text not null default 'new' check (onboarding_stage in ('new', 'in_progress', 'complete')),
  last_contact_at  timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Providers manage their own clients"
  on public.clients for all
  using (provider_id = auth.uid())
  with check (provider_id = auth.uid());

-- ============================================================
-- Sessions
-- ============================================================
create table if not exists public.sessions (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  date        timestamptz not null default now(),
  notes       text not null default '',
  summary     text not null default '',
  next_steps  text not null default '',
  created_at  timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Providers manage sessions for their clients"
  on public.sessions for all
  using (
    exists (
      select 1 from public.clients c
      where c.id = sessions.client_id and c.provider_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clients c
      where c.id = sessions.client_id and c.provider_id = auth.uid()
    )
  );

-- ============================================================
-- Tasks
-- ============================================================
create table if not exists public.tasks (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references public.clients(id) on delete cascade,
  title             text not null,
  due_date          timestamptz,
  status            text not null default 'todo' check (status in ('todo', 'done', 'overdue')),
  follow_up_status  text not null default 'pending' check (follow_up_status in ('pending', 'sent', 'complete')),
  created_at        timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Providers manage tasks for their clients"
  on public.tasks for all
  using (
    exists (
      select 1 from public.clients c
      where c.id = tasks.client_id and c.provider_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clients c
      where c.id = tasks.client_id and c.provider_id = auth.uid()
    )
  );

-- ============================================================
-- Intake forms
-- ============================================================
create table if not exists public.intake_forms (
  id          uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  questions   jsonb not null default '[]',
  reusable    boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.intake_forms enable row level security;

create policy "Providers manage their own intake forms"
  on public.intake_forms for all
  using (provider_id = auth.uid())
  with check (provider_id = auth.uid());
