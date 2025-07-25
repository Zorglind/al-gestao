import { supabase } from '@/integrations/supabase/client';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  profession?: string;
  instagram?: string;
  observations?: string;
  avatar_url?: string;
  is_active: boolean;
  last_visit?: string;
  total_services: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  profession?: string;
  instagram?: string;
  observations?: string;
  avatar_url?: string;
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  profession?: string;
  instagram?: string;
  observations?: string;
  avatar_url?: string;
  is_active?: boolean;
  last_visit?: string;
  total_services?: number;
}

export const clientsService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      throw error;
    }

    return data;
  },

  async create(clientData: CreateClientData): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...clientData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, clientData: UpdateClientData): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  async toggleActive(id: string): Promise<Client> {
    const client = await this.getById(id);
    if (!client) throw new Error('Client not found');

    return this.update(id, { is_active: !client.is_active });
  }
};