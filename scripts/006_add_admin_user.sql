-- Create admin user for the platform
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
);

-- Insert corresponding profile in public.users table
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
  id,
  'admin@gmail.com',
  'System Administrator',
  'admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@gmail.com';
