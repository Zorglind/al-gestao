import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  horario: string;
  status: string;
  data: string;
}

interface AgendaContextData {
  agendamentos: Agendamento[];
  setAgendamentos: (agendamentos: Agendamento[]) => void;
  updateAgendamento: (id: number, updates: Partial<Agendamento>) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const AgendaContext = createContext<AgendaContextData | undefined>(undefined);

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const updateAgendamento = (id: number, updates: Partial<Agendamento>) => {
    setAgendamentos(prev => 
      prev.map(agendamento => 
        agendamento.id === id 
          ? { ...agendamento, ...updates }
          : agendamento
      )
    );
  };

  const saveToStorage = () => {
    localStorage.setItem('agenda-agendamentos', JSON.stringify(agendamentos));
  };

  const loadFromStorage = () => {
    const stored = localStorage.getItem('agenda-agendamentos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAgendamentos(parsed);
      } catch (error) {
        console.error('Erro ao carregar agendamentos do storage:', error);
      }
    }
  };

  // Auto-save when agendamentos change
  useEffect(() => {
    if (agendamentos.length > 0) {
      saveToStorage();
    }
  }, [agendamentos]);

  // Load on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <AgendaContext.Provider value={{
      agendamentos,
      setAgendamentos,
      updateAgendamento,
      saveToStorage,
      loadFromStorage,
    }}>
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (context === undefined) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
}