import { supabase } from '@/integrations/supabase/client';

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  company_name?: string;
  address?: string;
  cnpj?: string;
  work_start_time?: string;
  work_end_time?: string;
  bio?: string;
  avatar_url?: string;
  offered_services: any;
  social_networks: any;
  theme: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  company_name?: string;
  address?: string;
  cnpj?: string;
  work_start_time?: string;
  work_end_time?: string;
  bio?: string;
  avatar_url?: string;
  offered_services?: any;
  social_networks?: any;
  theme?: string;
  notifications_enabled?: boolean;
}

export const profileService = {
  async getProfile(): Promise<ProfessionalProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('professional_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  },

  async updateProfile(profileData: UpdateProfileData): Promise<ProfessionalProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('professional_profiles')
      .upsert({
        user_id: user.id,
        ...profileData
      }, { 
        onConflict: 'user_id' 
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Security validations
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxFileSize) {
      throw new Error('File size must be less than 5MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }

    // Validate file extension matches MIME type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const mimeTypeMap: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp']
    };
    
    const validExtensions = mimeTypeMap[file.type];
    if (!fileExt || !validExtensions?.includes(fileExt)) {
      throw new Error('File extension does not match file type');
    }

    // Generate secure filename
    const timestamp = Date.now();
    const fileName = `${user.id}/avatar_${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};