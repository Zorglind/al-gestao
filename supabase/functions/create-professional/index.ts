import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateProfessionalRequest {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  phone?: string;
  workStartTime?: string;
  workEndTime?: string;
  permissions?: Record<string, boolean>;
}

// Input validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function validatePassword(password: string): boolean {
  // Enforce strong password requirements
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
}

function validatePhone(phone?: string): boolean {
  if (!phone) return true;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

function validatePermissions(permissions?: Record<string, boolean>): Record<string, boolean> {
  const allowedPermissions = [
    'dashboard', 'clients', 'agenda', 'services', 'products', 
    'financial', 'anamnesis', 'professionals', 'exports', 'profile'
  ];
  
  const validatedPermissions: Record<string, boolean> = {
    dashboard: true,
    clients: true,
    agenda: true,
    anamnesis: true,
    profile: true,
    // Default safe permissions for new professionals
    services: false,
    products: false,
    financial: false,
    professionals: false,
    exports: false
  };

  if (permissions) {
    for (const [key, value] of Object.entries(permissions)) {
      if (allowedPermissions.includes(key) && typeof value === 'boolean') {
        validatedPermissions[key] = value;
      }
    }
  }

  return validatedPermissions;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated and is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Only admins can create professionals.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestData: CreateProfessionalRequest = await req.json();

    // Validate and sanitize inputs
    if (!requestData.name || !requestData.email || !requestData.password) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedName = sanitizeString(requestData.name);
    const sanitizedEmail = requestData.email.toLowerCase().trim();
    
    if (!validateEmail(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePassword(requestData.password)) {
      return new Response(
        JSON.stringify({ 
          error: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePhone(requestData.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validatedPermissions = validatePermissions(requestData.permissions);

    // Create the user with admin privileges
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email: sanitizedEmail,
      password: requestData.password,
      email_confirm: true,
      user_metadata: {
        name: sanitizedName
      }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create profile for the new professional
    const { error: profileCreateError } = await supabaseClient
      .from('profiles')
      .update({
        name: sanitizedName,
        role: 'professional',
        specialty: requestData.specialty ? sanitizeString(requestData.specialty) : null,
        phone: requestData.phone || null,
        work_start_time: requestData.workStartTime || null,
        work_end_time: requestData.workEndTime || null,
        permissions: validatedPermissions,
        created_by_admin: user.id,
        is_active: true
      })
      .eq('user_id', newUser.user.id);

    if (profileCreateError) {
      console.error('Error creating profile:', profileCreateError);
      // Cleanup: delete the created user if profile creation fails
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create professional profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the action for audit purposes
    console.log(`Professional created by admin ${user.id}: ${sanitizedEmail}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Professional created successfully',
        userId: newUser.user.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});