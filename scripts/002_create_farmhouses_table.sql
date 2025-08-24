-- Create farmhouses table
create table if not exists public.farmhouses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  location text not null,
  address text not null,
  price_per_night decimal(10,2) not null,
  max_guests integer not null default 1,
  bedrooms integer not null default 1,
  bathrooms integer not null default 1,
  amenities text[] default '{}',
  images text[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.farmhouses enable row level security;

-- RLS policies for farmhouses
create policy "Anyone can view active farmhouses"
  on public.farmhouses for select
  using (is_active = true);

create policy "Owners can view their own farmhouses"
  on public.farmhouses for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own farmhouses"
  on public.farmhouses for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own farmhouses"
  on public.farmhouses for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their own farmhouses"
  on public.farmhouses for delete
  using (auth.uid() = owner_id);

-- Admins can manage all farmhouses
create policy "Admins can manage all farmhouses"
  on public.farmhouses for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
