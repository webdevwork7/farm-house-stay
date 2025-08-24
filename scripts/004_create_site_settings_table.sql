-- Create site settings table
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- RLS policies for site settings
create policy "Anyone can view site settings"
  on public.site_settings for select
  to public;

-- Only admins can manage site settings
create policy "Admins can manage site settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default site settings
insert into public.site_settings (key, value, description) values
  ('site_name', 'FarmStay Oasis', 'Website name'),
  ('site_description', 'Discover authentic farm experiences and book your perfect rural getaway', 'Website description'),
  ('contact_email', 'info@farmstayoasis.com', 'Contact email'),
  ('contact_phone', '+1 (555) 123-4567', 'Contact phone number'),
  ('hero_title', 'Escape to Nature''s Embrace', 'Hero section title'),
  ('hero_subtitle', 'Discover authentic farm experiences and reconnect with the countryside', 'Hero section subtitle')
on conflict (key) do nothing;
