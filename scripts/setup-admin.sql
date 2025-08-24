-- Setup admin user with proper authentication
-- This script ensures the admin user exists and can login

-- First, check if admin user exists in auth.users
DO $$
BEGIN
  -- Insert admin user into auth.users if not exists
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
  ) 
  SELECT 
    gen_random_uuid(),
    'admin@gmail.com',
    crypt('admin@123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}',
    false,
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com'
  );

  -- Insert corresponding profile in public.users table if not exists
  INSERT INTO public.users (id, email, full_name, role, is_active, created_at, updated_at)
  SELECT 
    au.id,
    'admin@gmail.com',
    'System Administrator',
    'admin',
    true,
    now(),
    now()
  FROM auth.users au 
  WHERE au.email = 'admin@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'admin@gmail.com'
  );
END $$;

-- Ensure site settings exist
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', 'FarmStay Oasis', 'Website name'),
('contact_phone', '+91 99999 88888', 'Contact phone number'),
('contact_email', 'info@farmstayoasis.com', 'Contact email'),
('hero_title', 'Farm House for Rent in', 'Hero section main title'),
('hero_subtitle', 'Hyderabad & Nearby', 'Hero section subtitle'),
('hero_description', 'Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.', 'Hero section description'),
('about_title', 'About FarmStay Oasis', 'About section title'),
('about_description', 'We are passionate about connecting people with nature through authentic farmstay experiences. Our carefully curated collection of premium farm houses offers the perfect escape from city life.', 'About section description'),
('cta_title', 'Ready for Your Farm Adventure?', 'Call to action section title'),
('cta_description', 'Book your perfect farmstay today and create memories that will last a lifetime.', 'Call to action description')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();