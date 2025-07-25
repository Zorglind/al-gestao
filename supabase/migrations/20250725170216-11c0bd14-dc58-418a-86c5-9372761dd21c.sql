-- Create professional_profiles table for persistent profile data
CREATE TABLE public.professional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  address TEXT,
  cnpj TEXT,
  work_start_time TIME,
  work_end_time TIME,
  bio TEXT,
  avatar_url TEXT,
  offered_services JSONB DEFAULT '[]'::JSONB,
  social_networks JSONB DEFAULT '{}'::JSONB,
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for professional profiles
CREATE POLICY "Users can view their own profile" 
ON public.professional_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.professional_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.professional_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.professional_profiles 
FOR SELECT 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_professional_profiles_updated_at
BEFORE UPDATE ON public.professional_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();