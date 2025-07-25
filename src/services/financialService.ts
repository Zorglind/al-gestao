import { supabase } from '@/integrations/supabase/client';

export interface FinancialEntry {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  time: string;
  payment_method: string;
  observations: string;
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
  subcategory: string;
  date: string;
  time: string;
  payment_method: string;
  observations: string;
  appointment_id?: string;
}

export interface UpdateFinancialEntryData {
  description?: string;
  amount?: number;
  category?: string;
  subcategory?: string;
  date?: string;
  time?: string;
  payment_method?: string;
  observations?: string;
  appointment_id?: string;
}

// Fixed categories and subcategories
export const FINANCIAL_CATEGORIES = {
  income: {
    produto: ['produto'],
    servico: ['servico'],
    pacote: ['pacote']
  },
  expense: {
    despesas_fixas: ['aluguel', 'contador', 'internet', 'seguranca'],
    despesas_variaveis: ['compra_produto', 'descartaveis', 'limpeza', 'luz', 'manutencao', 'papelaria', 'telefone', 'toalhas'],
    despesas_pessoal: ['alimentacao', 'bonificacao', 'pagamento_profissional', 'pro_labore', 'passagem_vale_transporte', 'vale_adiantamento_profissional', 'investimento_treinamentos'],
    impostos: ['imposto_municipal', 'imposto_estadual', 'imposto_federal'],
    outras_despesas: [],
    reserva_financeira: []
  }
} as const;

export const PAYMENT_METHODS = ['dinheiro', 'cartao', 'pix', 'transferencia', 'outros'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  // Income
  produto: 'Produto',
  servico: 'Serviço', 
  pacote: 'Pacote',
  // Expenses
  despesas_fixas: 'Despesas Fixas',
  despesas_variaveis: 'Despesas Variáveis',
  despesas_pessoal: 'Despesas de Pessoal',
  impostos: 'Impostos',
  outras_despesas: 'Outras Despesas',
  reserva_financeira: 'Reserva Financeira'
};

export const SUBCATEGORY_LABELS: Record<string, string> = {
  // Income subcategories
  produto: 'Produto',
  servico: 'Serviço',
  pacote: 'Pacote',
  // Fixed expenses
  aluguel: 'Aluguel',
  contador: 'Contador',
  internet: 'Internet',
  seguranca: 'Segurança',
  // Variable expenses
  compra_produto: 'Compra de Produto',
  descartaveis: 'Descartáveis',
  limpeza: 'Limpeza',
  luz: 'Luz',
  manutencao: 'Manutenção',
  papelaria: 'Papelaria',
  telefone: 'Telefone',
  toalhas: 'Toalhas',
  // Personnel expenses
  alimentacao: 'Alimentação',
  bonificacao: 'Bonificação',
  pagamento_profissional: 'Pagamento Profissional',
  pro_labore: 'Pró-Labore',
  passagem_vale_transporte: 'Passagem/Vale Transporte',
  vale_adiantamento_profissional: 'Vale/Adiantamento Profissional',
  investimento_treinamentos: 'Investimento em Treinamentos',
  // Taxes
  imposto_municipal: 'Imposto Municipal',
  imposto_estadual: 'Imposto Estadual',
  imposto_federal: 'Imposto Federal'
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  pix: 'PIX',
  transferencia: 'Transferência',
  outros: 'Outros'
};

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