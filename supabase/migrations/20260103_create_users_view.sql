-- Create a view in the public schema that exposes auth.users data
CREATE OR REPLACE VIEW public.users AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'first_name' as first_name,
  raw_user_meta_data->>'last_name' as last_name,
  created_at,
  updated_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.users TO anon, authenticated;
