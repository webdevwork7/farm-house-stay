-- Create indexes for better performance
create index if not exists idx_farmhouses_owner_id on public.farmhouses(owner_id);
create index if not exists idx_farmhouses_location on public.farmhouses(location);
create index if not exists idx_farmhouses_price on public.farmhouses(price_per_night);
create index if not exists idx_farmhouses_active on public.farmhouses(is_active);

create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_farmhouse_id on public.bookings(farmhouse_id);
create index if not exists idx_bookings_dates on public.bookings(check_in_date, check_out_date);
create index if not exists idx_bookings_status on public.bookings(status);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_users_email on public.users(email);
