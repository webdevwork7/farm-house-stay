-- Adding comprehensive dummy farmhouse data with realistic details
INSERT INTO farmhouses (
  id,
  name,
  description,
  location,
  price_per_night,
  max_guests,
  bedrooms,
  bathrooms,
  amenities,
  images,
  is_active,
  owner_id,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Serenity Farm Retreat',
  'Experience tranquility at our beautiful 10-acre organic farm featuring traditional architecture, modern amenities, and breathtaking countryside views. Perfect for families and groups seeking an authentic rural experience.',
  'Shamirpet, Hyderabad',
  8500,
  12,
  4,
  3,
  ARRAY['Swimming Pool', 'Organic Garden', 'Bonfire Area', 'Farm Animals', 'Outdoor Kitchen', 'WiFi', 'AC Rooms', 'Parking'],
  ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
  true,
  (SELECT id FROM users WHERE email = 'admin@gmail.com'),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Green Valley Farmhouse',
  'Escape to our eco-friendly farmhouse surrounded by lush green fields and fruit orchards. Enjoy farm-to-table meals, nature walks, and peaceful evenings under the stars.',
  'Medak, Telangana',
  6500,
  8,
  3,
  2,
  ARRAY['Organic Farm', 'Fruit Orchard', 'Nature Trails', 'Farm-to-Table Meals', 'Yoga Deck', 'WiFi', 'Solar Power', 'Pet Friendly'],
  ARRAY[
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464822759844-d150baec0494?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
  true,
  (SELECT id FROM users WHERE email = 'admin@gmail.com'),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Heritage Farm Villa',
  'Step back in time at our restored heritage farmhouse featuring traditional Telangana architecture, antique furnishings, and modern comforts. Includes cultural activities and local cuisine experiences.',
  'Vikarabad, Telangana',
  12000,
  16,
  6,
  4,
  ARRAY['Heritage Architecture', 'Cultural Activities', 'Traditional Cuisine', 'Antique Furnishings', 'Large Garden', 'Event Space', 'Catering Service', 'WiFi'],
  ARRAY[
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
  true,
  (SELECT id FROM users WHERE email = 'admin@gmail.com'),
  NOW(),
  NOW()
);
