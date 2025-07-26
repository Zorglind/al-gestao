import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  appointmentsToday: number;
  clientsThisMonth: number;
  pendingConfirmations: number;
  monthlyRevenue: number;
}

export interface TodayAppointment {
  id: string;
  client_name: string;
  time: string;
  service_name: string;
  status: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

    // Get appointments today
    const { data: todayAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', today);

    if (appointmentsError) {
      console.error('Error fetching today appointments:', appointmentsError);
    }

    // Get clients this month
    const { data: monthlyClients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .gte('created_at', startOfMonth)
      .lte('created_at', endOfMonth + 'T23:59:59.999Z')
      .eq('is_active', true);

    if (clientsError) {
      console.error('Error fetching monthly clients:', clientsError);
    }

    // Get pending confirmations (scheduled appointments)
    const { data: pendingAppointments, error: pendingError } = await supabase
      .from('appointments')
      .select('id')
      .eq('status', 'scheduled');

    if (pendingError) {
      console.error('Error fetching pending appointments:', pendingError);
    }

    // Get monthly revenue from financial entries
    const { data: monthlyIncome, error: incomeError } = await supabase
      .from('financial_entries')
      .select('amount')
      .eq('type', 'income')
      .gte('date', startOfMonth)
      .lte('date', endOfMonth);

    if (incomeError) {
      console.error('Error fetching monthly income:', incomeError);
    }

    const monthlyRevenue = monthlyIncome?.reduce((acc, entry) => acc + Number(entry.amount), 0) || 0;

    return {
      appointmentsToday: todayAppointments?.length || 0,
      clientsThisMonth: monthlyClients?.length || 0,
      pendingConfirmations: pendingAppointments?.length || 0,
      monthlyRevenue
    };
  },

  async getTodayAppointments(): Promise<TodayAppointment[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        time,
        status,
        clients (name),
        services (name)
      `)
      .eq('date', today)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching today appointments:', error);
      throw error;
    }

    return data?.map(appointment => ({
      id: appointment.id,
      client_name: appointment.clients?.name || 'Cliente não encontrado',
      time: appointment.time,
      service_name: appointment.services?.name || 'Serviço não encontrado',
      status: appointment.status
    })) || [];
  },

  async getRecentClients(limit: number = 5): Promise<Array<{id: string, name: string, created_at: string}>> {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent clients:', error);
      throw error;
    }

    return data || [];
  },

  async getMonthlyTrends(): Promise<{
    appointmentsTrend: number;
    clientsTrend: number;
    revenueTrend: number;
  }> {
    // For now, return mock trend data
    // In a real implementation, you would compare with previous month data
    return {
      appointmentsTrend: 12, // +12%
      clientsTrend: 8,       // +8%
      revenueTrend: 15       // +15%
    };
  }
};