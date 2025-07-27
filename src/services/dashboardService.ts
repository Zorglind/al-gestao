import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  agendamentosHoje: number;
  clientesMes: number;
  confirmacoesaPendentes: number;
  faturamentoMensal: number;
}

export interface AgendamentoHoje {
  id: string;
  cliente: string;
  horario: string;
  servico: string;
  status: string;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      // Agendamentos hoje
      const { count: agendamentosHoje } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('date', hoje);

      // Clientes novos do mês
      const { count: clientesMes } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes);

      // Confirmações pendentes (agendamentos com status 'scheduled')
      const { count: confirmacoesaPendentes } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled')
        .gte('date', hoje);

      // Faturamento mensal (entradas financeiras do tipo 'income')
      const { data: faturamentoData } = await supabase
        .from('financial_entries')
        .select('amount')
        .eq('type', 'income')
        .gte('date', inicioMes);

      const faturamentoMensal = faturamentoData?.reduce((total, entry) => 
        total + Number(entry.amount), 0) || 0;

      return {
        agendamentosHoje: agendamentosHoje || 0,
        clientesMes: clientesMes || 0,
        confirmacoesaPendentes: confirmacoesaPendentes || 0,
        faturamentoMensal: Number(faturamentoMensal)
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      return {
        agendamentosHoje: 0,
        clientesMes: 0,
        confirmacoesaPendentes: 0,
        faturamentoMensal: 0
      };
    }
  }

  async getAgendamentosHoje(): Promise<AgendamentoHoje[]> {
    try {
      const hoje = new Date().toISOString().split('T')[0];

      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          id,
          time,
          status,
          client_id,
          service_id,
          clients:client_id (name),
          services:service_id (name)
        `)
        .eq('date', hoje)
        .order('time', { ascending: true });

      if (!appointments) return [];

      return appointments.map((appointment: any) => ({
        id: appointment.id,
        cliente: appointment.clients?.name || 'Cliente não encontrado',
        horario: appointment.time.substring(0, 5), // HH:MM format
        servico: appointment.services?.name || 'Serviço não especificado',
        status: appointment.status
      }));
    } catch (error) {
      console.error('Erro ao buscar agendamentos de hoje:', error);
      return [];
    }
  }

  async getClientesRecentes(): Promise<any[]> {
    try {
      const { data: clients } = await supabase
        .from('clients')
        .select('id, name, created_at, last_visit')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      return clients || [];
    } catch (error) {
      console.error('Erro ao buscar clientes recentes:', error);
      return [];
    }
  }

  async getProximosAgendamentos(): Promise<any[]> {
    try {
      const hoje = new Date().toISOString().split('T')[0];

      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          time,
          status,
          clients:client_id (name),
          services:service_id (name)
        `)
        .gte('date', hoje)
        .eq('status', 'scheduled')
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(5);

      return appointments || [];
    } catch (error) {
      console.error('Erro ao buscar próximos agendamentos:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();