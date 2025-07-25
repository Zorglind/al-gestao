import { supabase } from '@/integrations/supabase/client';

export interface FinancialEntry {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  appointment_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFinancialEntryData {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  appointment_id?: string;
}

export interface UpdateFinancialEntryData {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
  appointment_id?: string;
}

export const financialService = {
  async getAll(): Promise<FinancialEntry[]> {
    const { data, error } = await supabase
      .from('financial_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching financial entries:', error);
      throw error;
    }

    return data || [];
  },

  async getByType(type: 'income' | 'expense'): Promise<FinancialEntry[]> {
    const { data, error } = await supabase
      .from('financial_entries')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching financial entries by type:', error);
      throw error;
    }

    return data || [];
  },

  async getByDateRange(startDate: string, endDate: string): Promise<FinancialEntry[]> {
    const { data, error } = await supabase
      .from('financial_entries')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching financial entries by date range:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<FinancialEntry | null> {
    const { data, error } = await supabase
      .from('financial_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching financial entry:', error);
      throw error;
    }

    return data;
  },

  async create(entryData: CreateFinancialEntryData): Promise<FinancialEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('financial_entries')
      .insert({
        ...entryData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial entry:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, entryData: UpdateFinancialEntryData): Promise<FinancialEntry> {
    const { data, error } = await supabase
      .from('financial_entries')
      .update(entryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial entry:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting financial entry:', error);
      throw error;
    }
  },

  async getSummary(startDate?: string, endDate?: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    incomeCount: number;
    expenseCount: number;
  }> {
    let query = supabase.from('financial_entries').select('type, amount');
    
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching financial summary:', error);
      throw error;
    }

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      incomeCount: 0,
      expenseCount: 0
    };

    data?.forEach(entry => {
      if (entry.type === 'income') {
        summary.totalIncome += Number(entry.amount);
        summary.incomeCount++;
      } else {
        summary.totalExpenses += Number(entry.amount);
        summary.expenseCount++;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpenses;
    return summary;
  }
};