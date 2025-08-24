-- Create bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  farmhouse_id uuid not null references public.farmhouses(id) on delete cascade,
  check_in_date date not null,
  check_out_date date not null,
  guests integer not null default 1,
  total_amount decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure check-out is after check-in
  constraint valid_dates check (check_out_date > check_in_date)
);

-- Enable RLS
alter table public.bookings enable row level security;

-- RLS policies for bookings
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

-- Owners can view bookings for their farmhouses
create policy "Owners can view bookings for their farmhouses"
  on public.bookings for select
  using (
    exists (
      select 1 from public.farmhouses
      where id = farmhouse_id and owner_id = auth.uid()
    )
  );

-- Owners can update booking status for their farmhouses
create policy "Owners can update booking status for their farmhouses"
  on public.bookings for update
  using (
    exists (
      select 1 from public.farmhouses
      where id = farmhouse_id and owner_id = auth.uid()
    )
  );

-- Admins can manage all bookings
create policy "Admins can manage all bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
