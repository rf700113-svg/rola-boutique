create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text,
  price text,
  category text,
  sizes text,
  colors text,
  description text,
  image_url text,
  sort_order integer,
  is_active boolean default true,
  is_new boolean default false,
  show_on_home boolean default false,
  line_text text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists products_home_new_idx
  on public.products (is_active, is_new, show_on_home, sort_order, created_at);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
