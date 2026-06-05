create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text,
  category text default '洋裝',
  sizes text,
  colors text,
  description text,
  image_url text,
  images jsonb default '[]',
  sort_order integer default 999,
  is_active boolean default true,
  is_new boolean default true,
  show_on_home boolean default true,
  line_text text default 'LINE 詢問尺寸',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists site_settings (
  id text primary key default 'default',
  logo_text text default 'ROLA',
  logo_subtitle text default 'BOUTIQUE',
  hero_image_url text,
  hero_kicker text default 'LUXURY FASHION BOUTIQUE',
  hero_title text default 'ROLA',
  hero_subtitle text default 'Timeless Elegance Since 2012',
  hero_description text default '獻給懂得生活品味的妳，\n從日常到重要時刻，\n用質感穿搭展現自信與優雅。',
  hero_primary_text text default '探索新品',
  hero_primary_url text default '#new-arrivals',
  hero_secondary_text text default 'LINE 一對一詢問',
  hero_secondary_url text default 'https://line.me/R/ti/p/@sxg2195h',
  line_title text default '加入 ROLA LINE',
  line_subtitle text default '新品詢問｜尺寸建議｜一對一穿搭服務',
  line_button_text text default 'LINE 一對一詢問',
  facebook_button_text text default 'Facebook 最新穿搭',
  footer_text text default '© 2026 ROLA Boutique',
  homepage_product_limit integer default 6,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists social_settings (
  id text primary key default 'default',
  line_url text default 'https://line.me/R/ti/p/@sxg2195h',
  facebook_url text default 'https://www.facebook.com/1381990545159062',
  instagram_url text,
  show_line_button boolean default true,
  show_facebook_button boolean default true,
  show_floating_line boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists seo_settings (
  id text primary key default 'default',
  title text default 'ROLA Boutique｜質感女裝選品店',
  description text default 'ROLA Boutique Since 2012，專注質感與風格的女裝選品，提供新品穿搭、洋裝、外套與一對一 LINE 諮詢服務。',
  og_title text default 'ROLA Boutique｜質感女裝選品店',
  og_description text default '質感女裝選品、新品穿搭、洋裝、外套與 LINE 一對一諮詢。',
  og_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into site_settings (id) values ('default')
on conflict (id) do nothing;

insert into social_settings (id) values ('default')
on conflict (id) do nothing;

insert into seo_settings (id) values ('default')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('site-images', 'site-images', true)
on conflict (id) do update set public = true;
