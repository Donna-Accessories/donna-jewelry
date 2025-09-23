-- Create policies for authenticated users (admin)
create policy "Allow authenticated users to create products"
  on public.products
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users to delete products"
  on public.products
  for delete
  to authenticated
  using (true);

-- Categories policies
create policy "Allow authenticated users to manage categories"
  on public.categories
  for all
  to authenticated
  using (true)
  with check (true);

-- Settings policies
create policy "Allow authenticated users to manage settings"
  on public.settings
  for all
  to authenticated
  using (true)
  with check (true);

-- Read policies for anonymous users
create policy "Allow anonymous read access to categories"
  on public.categories
  for select
  to anon
  using (true);

create policy "Allow anonymous read access to settings"
  on public.settings
  for select
  to anon
  using (true);
