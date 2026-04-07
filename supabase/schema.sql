-- ============================================================
-- RushRadar Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database
-- ============================================================

-- ─── Branches ────────────────────────────────────────────────
create table if not exists public.branches (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  location   text,
  user_id    uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ─── Orders ──────────────────────────────────────────────────
create table if not exists public.orders (
  id         uuid default gen_random_uuid() primary key,
  timestamp  timestamptz not null,
  branch_id  uuid references public.branches(id) on delete cascade,
  revenue    numeric(10,2) not null default 0,
  items      jsonb default '[]'::jsonb,
  user_id    uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ─── Inventory ───────────────────────────────────────────────
create table if not exists public.inventory (
  id              uuid default gen_random_uuid() primary key,
  ingredient      text not null,
  current_stock   numeric(10,2) default 0,
  usage_per_order numeric(10,4) default 0,
  branch_id       uuid references public.branches(id) on delete cascade,
  user_id         uuid references auth.users(id) on delete cascade,
  created_at      timestamptz default now()
);

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists idx_orders_branch    on public.orders(branch_id);
create index if not exists idx_orders_timestamp on public.orders(timestamp);
create index if not exists idx_orders_user      on public.orders(user_id);
create index if not exists idx_inventory_branch on public.inventory(branch_id);

-- ─── Row Level Security ──────────────────────────────────────
-- Enable RLS on all tables
alter table public.branches  enable row level security;
alter table public.orders    enable row level security;
alter table public.inventory enable row level security;

-- Permissive policies (allow all for now — tighten when auth is wired)
create policy "branches_all" on public.branches for all using (true) with check (true);
create policy "orders_all"   on public.orders   for all using (true) with check (true);
create policy "inventory_all" on public.inventory for all using (true) with check (true);

-- ─── Storage Bucket (run separately in Storage settings) ─────
-- Create a bucket called "csv-uploads" in Supabase Dashboard → Storage
-- Set it to public or add a policy for authenticated uploads.
