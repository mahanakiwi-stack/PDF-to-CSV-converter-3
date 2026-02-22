-- Create usage_logs table
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  page_count int not null,
  transaction_count int not null,
  csv_data text not null,
  created_at timestamptz not null default now()
);

alter table public.usage_logs enable row level security;

create policy "usage_logs_select_own" on public.usage_logs
  for select using (auth.uid() = user_id);

create policy "usage_logs_insert_own" on public.usage_logs
  for insert with check (auth.uid() = user_id);

-- Index for efficient daily usage queries
create index if not exists idx_usage_logs_user_created
  on public.usage_logs (user_id, created_at desc);
