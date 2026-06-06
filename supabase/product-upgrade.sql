alter table products
add column if not exists images jsonb default '[]';

alter table products
add column if not exists updated_at timestamptz default now();

alter table products
add column if not exists stock_status text default '現貨';

alter table products
add column if not exists stock_quantity integer default 0;
