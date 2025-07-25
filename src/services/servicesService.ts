import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  commission_percentage?: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceData {
  name: string;
  category: string;
  description?: string;
  duration: number;
  price: number;
  commission_percentage?: number;
}

export interface UpdateServiceData {
  name?: string;
  category?: string;
  description?: string;
  duration?: number;
  price?: number;
  commission_percentage?: number;
  is_active?: boolean;
}

export const servicesService = {
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      throw error;
    }

    return data;
  },

  async create(serviceData: CreateServiceData): Promise<Service> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, serviceData: UpdateServiceData): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  async toggleActive(id: string, checked?: boolean): Promise<Service> {
    // If checked is provided, use it; otherwise toggle current state
    if (checked !== undefined) {
      return this.update(id, { is_active: checked });
    }
    
    // First get current state
    const service = await this.getById(id);
    if (!service) throw new Error('Service not found');

    return this.update(id, { is_active: !service.is_active });
  }
};