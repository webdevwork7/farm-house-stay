-- Create users table with proper authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'visitor' CHECK (role IN ('visitor', 'owner', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farmhouses table
CREATE TABLE IF NOT EXISTS public.farmhouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 1,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  farmhouse_id UUID REFERENCES public.farmhouses(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmhouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for farmhouses table
CREATE POLICY "Anyone can view active farmhouses" ON public.farmhouses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage their farmhouses" ON public.farmhouses
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all farmhouses" ON public.farmhouses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can view bookings for their properties" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farmhouses 
      WHERE id = farmhouse_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for site_settings table
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert admin user
INSERT INTO public.users (email, full_name, role, is_active) 
VALUES ('admin@gmail.com', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', 'FarmStay Oasis', 'Website name'),
('site_phone', '+91 99999 88888', 'Contact phone number'),
('hero_title', 'Farm House for Rent in', 'Hero section main title'),
('hero_subtitle', 'Hyderabad & Nearby', 'Hero section subtitle'),
('hero_description', 'Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.', 'Hero section description'),
('cta_primary', 'Explore Properties', 'Primary CTA button text'),
('cta_secondary', 'Call Now: +91 99999 88888', 'Secondary CTA button text')
ON CONFLICT (key) DO NOTHING;

-- Create owner user for farmhouses
INSERT INTO public.users (email, full_name, role, is_active) 
VALUES ('owner@farmstay.com', 'Farm Owner', 'owner', true)
ON CONFLICT (email) DO NOTHING;

-- Insert dummy farmhouses
INSERT INTO public.farmhouses (owner_id, name, description, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, images, rating, total_reviews) 
SELECT 
  u.id,
  'Serene Valley Farmhouse',
  'A beautiful farmhouse nestled in the serene valleys of Hyderabad outskirts. Perfect for family getaways with modern amenities and traditional charm.',
  'Shamirpet, Hyderabad',
  8500.00,
  8,
  3,
  2,
  ARRAY['WiFi', 'Swimming Pool', 'Garden', 'BBQ Area', 'Parking', 'Kitchen'],
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  4.8,
  24
FROM public.users u WHERE u.email = 'owner@farmstay.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.farmhouses (owner_id, name, description, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, images, rating, total_reviews) 
SELECT 
  u.id,
  'Rustic Retreat Farmstay',
  'Experience authentic rural life in this charming farmhouse with organic farming activities and peaceful surroundings.',
  'Medchal, Hyderabad',
  6500.00,
  6,
  2,
  2,
  ARRAY['WiFi', 'Garden', 'Farm Activities', 'Bonfire', 'Parking', 'Kitchen'],
  ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800'],
  4.6,
  18
FROM public.users u WHERE u.email = 'owner@farmstay.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.farmhouses (owner_id, name, description, location, price_per_night, max_guests, bedrooms, bathrooms, amenities, images, rating, total_reviews) 
SELECT 
  u.id,
  'Luxury Farm Villa',
  'Indulge in luxury at this premium farmhouse featuring a private pool, spa facilities, and gourmet dining options.',
  'Chevella, Hyderabad',
  12000.00,
  10,
  4,
  3,
  ARRAY['WiFi', 'Swimming Pool', 'Spa', 'Garden', 'BBQ Area', 'Parking', 'Kitchen', 'Air Conditioning'],
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  4.9,
  32
FROM public.users u WHERE u.email = 'owner@farmstay.com'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmhouses_location ON public.farmhouses(location);
CREATE INDEX IF NOT EXISTS idx_farmhouses_price ON public.farmhouses(price_per_night);
CREATE INDEX IF NOT EXISTS idx_farmhouses_active ON public.farmhouses(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
