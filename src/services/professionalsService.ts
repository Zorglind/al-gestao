import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/contexts/AuthContext";

export interface CreateProfessionalRequest {
  email: string;
  password: string;
  name: string;
  specialty?: string;
  phone?: string;
  workStartTime?: string;
  workEndTime?: string;
  permissions: {
    dashboard: boolean;
    clients: boolean;
    agenda: boolean;
    services: boolean;
    products: boolean;
    financial: boolean;
    anamnesis: boolean;
    professionals: boolean;
    exports: boolean;
    profile: boolean;
  };
}

export interface UpdatePermissionsRequest {
  userId: string;
  permissions: {
    dashboard: boolean;
    clients: boolean;
    agenda: boolean;
    services: boolean;
    products: boolean;
    financial: boolean;
    anamnesis: boolean;
    professionals: boolean;
    exports: boolean;
    profile: boolean;
  };
}

export const professionalsService = {
  // Listar todos os profissionais (apenas admins)
  async getAllProfessionals(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'professional')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }

    // Convert database types to our interface
    const profiles: UserProfile[] = (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      role: item.role,
      avatar_url: item.avatar_url,
      phone: item.phone,
      specialty: item.specialty,
      work_start_time: item.work_start_time,
      work_end_time: item.work_end_time,
      permissions: typeof item.permissions === 'object' && item.permissions !== null 
        ? item.permissions as any
        : {
            dashboard: true,
            clients: true,
            agenda: true,
            services: false,
            products: false,
            financial: false,
            anamnesis: true,
            professionals: false,
            exports: false,
            profile: true
          },
      created_by_admin: item.created_by_admin,
      is_active: item.is_active
    }));

    return profiles;
  },

  // Criar um novo profissional (apenas admins)
  async createProfessional(request: CreateProfessionalRequest) {
    try {
      // Primeiro, criar o usuário usando Supabase Auth Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: request.email,
        password: request.password,
        email_confirm: true, // Auto-confirmar email para usuários criados por admin
        user_metadata: {
          name: request.name
        }
      });

      if (authError) {
        console.error('Error creating user:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha ao criar usuário');
      }

      // Após criar o usuário, atualizar o perfil com informações específicas do profissional
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'professional',
          specialty: request.specialty,
          phone: request.phone,
          work_start_time: request.workStartTime,
          work_end_time: request.workEndTime,
          permissions: request.permissions,
          created_by_admin: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('user_id', authData.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Se falhar ao atualizar o perfil, deletar o usuário criado
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      return { success: true, user: authData.user };
    } catch (error) {
      console.error('Error in createProfessional:', error);
      throw error;
    }
  },

  // Atualizar permissões de um profissional (apenas admins)
  async updateProfessionalPermissions(request: UpdatePermissionsRequest) {
    const { data, error } = await supabase
      .rpc('update_professional_permissions', {
        professional_user_id: request.userId,
        new_permissions: request.permissions
      });

    if (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }

    return { success: true };
  },

  // Desativar um profissional (apenas admins)
  async deactivateProfessional(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('role', 'professional');

    if (error) {
      console.error('Error deactivating professional:', error);
      throw error;
    }

    return { success: true };
  },

  // Ativar um profissional (apenas admins)
  async activateProfessional(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('user_id', userId)
      .eq('role', 'professional');

    if (error) {
      console.error('Error activating professional:', error);
      throw error;
    }

    return { success: true };
  },

  // Verificar se usuário tem permissão específica
  async hasPermission(permission: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('has_permission', { permission_name: permission });

    if (error) {
      console.error('Error checking permission:', error);
      return false;
    }

    return data || false;
  }
};