-- ETAPA 1: Adicionar campos para informações de profissionais e permissões granulares
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS specialty text,
ADD COLUMN IF NOT EXISTS work_start_time time,
ADD COLUMN IF NOT EXISTS work_end_time time,
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{
  "dashboard": true,
  "clients": true,
  "agenda": true,
  "services": true,
  "products": true,
  "financial": true,
  "anamnesis": true,
  "professionals": false,
  "exports": true,
  "profile": true
}'::jsonb,
ADD COLUMN IF NOT EXISTS created_by_admin uuid REFERENCES auth.users(id);

-- ETAPA 2: Atualizar função handle_new_user para dar role admin para cadastros públicos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    name, 
    role,
    permissions
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    'admin', -- Todos os usuários que se cadastram publicamente são admins
    '{
      "dashboard": true,
      "clients": true,
      "agenda": true,
      "services": true,
      "products": true,
      "financial": true,
      "anamnesis": true,
      "professionals": true,
      "exports": true,
      "profile": true
    }'::jsonb
  );
  RETURN NEW;
END;
$function$;

-- ETAPA 3: Criar função para administradores criarem usuários profissionais
CREATE OR REPLACE FUNCTION public.create_professional_user(
  user_email text,
  user_password text,
  user_name text,
  user_specialty text DEFAULT NULL,
  user_phone text DEFAULT NULL,
  work_start time DEFAULT NULL,
  work_end time DEFAULT NULL,
  user_permissions jsonb DEFAULT '{
    "dashboard": true,
    "clients": true,
    "agenda": true,
    "services": false,
    "products": false,
    "financial": false,
    "anamnesis": true,
    "professionals": false,
    "exports": false,
    "profile": true
  }'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $function$
DECLARE
  new_user_id uuid;
  current_user_role app_role;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Apenas administradores podem criar novos profissionais';
  END IF;
  
  -- Esta função será chamada pelo código da aplicação usando Supabase Auth Admin API
  -- Por enquanto, apenas retorna um UUID placeholder
  -- A criação real do usuário será feita no frontend usando supabase.auth.admin.createUser()
  
  RETURN gen_random_uuid();
END;
$function$;

-- ETAPA 4: Função para atualizar permissões de um profissional
CREATE OR REPLACE FUNCTION public.update_professional_permissions(
  professional_user_id uuid,
  new_permissions jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $function$
DECLARE
  current_user_role app_role;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Apenas administradores podem alterar permissões';
  END IF;
  
  -- Atualizar as permissões do profissional
  UPDATE public.profiles 
  SET 
    permissions = new_permissions,
    updated_at = now()
  WHERE user_id = professional_user_id 
    AND role = 'professional';
  
  RETURN FOUND;
END;
$function$;

-- ETAPA 5: Função para verificar se usuário tem permissão específica
CREATE OR REPLACE FUNCTION public.has_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $function$
  SELECT COALESCE(
    (permissions ->> permission_name)::boolean,
    false
  )
  FROM public.profiles 
  WHERE user_id = auth.uid();
$function$;