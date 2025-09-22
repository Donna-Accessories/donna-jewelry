-- Create tables in Supabase SQL Editor

-- Products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price text not null,
  category text,
  image text,
  tags text[],
  in_stock boolean default true,
  featured boolean default false,
  date_added timestamp with time zone default timezone('utc'::text, now()),
  last_modified timestamp with time zone default timezone('utc'::text, now()),
  whatsapp_message text
);

-- Enable RLS (Row Level Security)
alter table public.products enable row level security;

-- Categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.categories enable row level security;

-- Settings table
create table public.settings (
  id uuid default gen_random_uuid() primary key,
  business_phone text not null,
  business_name text not null,
  message_template text,
  items_per_page integer default 12,
  featured_categories text[],
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.settings enable row level security;

-- Create policies
-- Allow anonymous read access to products
create policy "Allow anonymous read access"
  on public.products
  for select
  to anon
  using (true);

-- Allow authenticated users to insert/update/delete products
create policy "Allow authenticated insert"
  on public.products
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update"
  on public.products
  for update
  to authenticated
  using (true);

create policy "Allow authenticated delete"
  on public.products
  for delete
  to authenticated
  using (true);

-- Similar policies for categories
create policy "Allow anonymous read categories"
  on public.categories
  for select
  to anon
  using (true);

create policy "Allow authenticated manage categories"
  on public.categories
  for all
  to authenticated
  using (true);

-- Settings policies
create policy "Allow anonymous read settings"
  on public.settings
  for select
  to anon
  using (true);

create policy "Allow authenticated manage settings"
  on public.settings
  for all
  to authenticated
  using (true);

-- Create storage bucket for product images
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true);

-- Allow public access to product images
create policy "Public access to product images"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'product-images');

-- Allow authenticated users to manage product images
create policy "Allow authenticated manage product images"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'product-images');
