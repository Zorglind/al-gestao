import { supabase } from '@/integrations/supabase/client';

export interface CreateProfessionalRequest {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  phone?: string;
  workStartTime?: string;
  workEndTime?: string;
  permissions?: Record<string, boolean>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Client-side validation utilities
export const validateInput = {
  email: (email: string): ValidationResult => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    } else if (email.length > 254) {
      errors.push('Email is too long');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  password: (password: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return { isValid: errors.length === 0, errors };
  },

  phone: (phone?: string): ValidationResult => {
    const errors: string[] = [];
    
    if (phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      if (!phoneRegex.test(cleanPhone)) {
        errors.push('Invalid phone number format');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  },

  name: (name: string): ValidationResult => {
    const errors: string[] = [];
    
    if (!name || !name.trim()) {
      errors.push('Name is required');
    } else if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (name.length > 100) {
      errors.push('Name is too long');
    } else if (/[<>]/.test(name)) {
      errors.push('Name contains invalid characters');
    }
    
    return { isValid: errors.length === 0, errors };
  }
};

export const secureProfessionalsService = {
  async createProfessional(request: CreateProfessionalRequest): Promise<{ success: boolean; error?: string }> {
    try {
      // Client-side validation
      const nameValidation = validateInput.name(request.name);
      const emailValidation = validateInput.email(request.email);
      const passwordValidation = validateInput.password(request.password);
      const phoneValidation = validateInput.phone(request.phone);

      const allErrors = [
        ...nameValidation.errors,
        ...emailValidation.errors,
        ...passwordValidation.errors,
        ...phoneValidation.errors
      ];

      if (allErrors.length > 0) {
        return { success: false, error: allErrors.join(', ') };
      }

      // Call secure edge function
      const { data, error } = await supabase.functions.invoke('create-professional', {
        body: {
          name: request.name.trim(),
          email: request.email.toLowerCase().trim(),
          password: request.password,
          specialty: request.specialty?.trim(),
          phone: request.phone?.replace(/[\s\-\(\)]/g, ''),
          workStartTime: request.workStartTime,
          workEndTime: request.workEndTime,
          permissions: request.permissions
        }
      });

      if (error) {
        console.error('Error calling create-professional function:', error);
        return { success: false, error: 'Failed to create professional' };
      }

      if (!data?.success) {
        return { success: false, error: data?.error || 'Unknown error occurred' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in createProfessional:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async updatePermissions(userId: string, permissions: Record<string, boolean>): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate permissions
      const allowedPermissions = [
        'dashboard', 'clients', 'agenda', 'services', 'products', 
        'financial', 'anamnesis', 'professionals', 'exports', 'profile'
      ];

      const validatedPermissions: Record<string, boolean> = {};
      for (const [key, value] of Object.entries(permissions)) {
        if (allowedPermissions.includes(key) && typeof value === 'boolean') {
          validatedPermissions[key] = value;
        }
      }

      const { error } = await supabase.rpc('update_professional_permissions', {
        professional_user_id: userId,
        new_permissions: validatedPermissions
      });

      if (error) {
        console.error('Error updating permissions:', error);
        return { success: false, error: 'Failed to update permissions' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updatePermissions:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
};