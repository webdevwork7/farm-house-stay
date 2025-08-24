-- First, create a dummy owner user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'owner@farmstay.com',
  crypt('owner123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "owner"}',
  false,
  'authenticated'
);

-- Insert corresponding profile in public.users table
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'owner@farmstay.com', 'Farm Owner', 'owner', now(), now());

-- Insert dummy farmhouses
INSERT INTO farmhouses (
  id, owner_id, name, description, location, price_per_night, max_guests, bedrooms, bathrooms,
  amenities, images, is_active, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  'Serenity Farm Villa',
  'A luxurious farmhouse surrounded by lush green fields and organic gardens. Perfect for families and groups looking for a peaceful retreat with modern amenities.',
  'Shamirpet, Hyderabad',
  8500,
  12,
  4,
  3,
  '["Swimming Pool", "WiFi", "Air Conditioning", "Kitchen", "Parking", "Garden", "BBQ Area", "Bonfire", "Indoor Games", "Outdoor Games"]',
  '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"]',
  true,
  now(),
  now()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  'Rustic Charm Farmstay',
  'Experience authentic farm life in this beautifully restored traditional farmhouse. Enjoy fresh organic produce and peaceful countryside views.',
  'Medak, Telangana',
  6500,
  8,
  3,
  2,
  '["WiFi", "Kitchen", "Parking", "Garden", "Farm Activities", "Organic Food", "Cycling", "Nature Walks", "Bird Watching"]',
  '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800", "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800"]',
  true,
  now(),
  now()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',
  'Green Valley Retreat',
  'A modern eco-friendly farmhouse nestled in the hills with panoramic valley views. Features solar power and rainwater harvesting.',
  'Vikarabad, Telangana',
  12000,
  16,
  5,
  4,
  '["Swimming Pool", "WiFi", "Air Conditioning", "Kitchen", "Parking", "Garden", "Solar Power", "Eco-Friendly", "Valley Views", "Trekking", "Yoga Deck"]',
  '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"]',
  true,
  now(),
  now()
);
