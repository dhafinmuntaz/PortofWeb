-- Run once in Supabase: SQL Editor > New query.
create table if not exists public.site_content (
  key text primary key check (key in ('projects', 'profile')),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Public can read portfolio content" on public.site_content
  for select using (true);

create policy "Signed-in admin can manage content" on public.site_content
  for all to authenticated using (true) with check (true);

-- Seed the first rows by signing in to admin.html and pressing Save Changes.
