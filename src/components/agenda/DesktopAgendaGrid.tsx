import { User } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DroppableTimeSlot } from "./DroppableTimeSlot";

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  horario: string;
  status: string;
  data: string;
}

interface DesktopAgendaGridProps {
  agendamentos: Agendamento[];
  profissionais: string[];
  horarios: string[];
  DraggableAgendamento: React.ComponentType<{
    agendamento: Agendamento;
    updateStatus: (id: number, status: string) => void;
  }>;
  updateAgendamentoStatus: (id: number, status: string) => void;
}

export function DesktopAgendaGrid({
  agendamentos,
  profissionais,
  horarios,
  DraggableAgendamento,
  updateAgendamentoStatus,
}: DesktopAgendaGridProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4">
      {/* Coluna de Horários */}
      <div className="space-y-2">
        <div className="h-16 flex items-center justify-center font-semibold text-sm bg-muted rounded">
          Horário
        </div>
        {horarios.map((hora) => (
          <div key={hora} className="h-20 flex items-center justify-center text-sm text-muted-foreground border rounded">
            {hora}
          </div>
        ))}
      </div>

      {/* Coluna do Profissional Selecionado */}
      {profissionais.map((profissional) => (
        <div key={profissional} className="space-y-2">
          <div className="h-16 flex items-center justify-center font-semibold text-sm bg-primary text-primary-foreground rounded">
            <User className="h-4 w-4 mr-2" />
            {profissional}
          </div>
          <SortableContext
            items={agendamentos.filter(a => a.profissional === profissional).map(a => a.id)}
            strategy={verticalListSortingStrategy}
          >
            {horarios.map((hora) => {
              const agendamento = agendamentos.find(
                a => a.horario === hora && a.profissional === profissional
              );

              return (
                <DroppableTimeSlot
                  key={`${profissional}-${hora}`}
                  id={`${profissional}-${hora}`}
                  className="h-20"
                >
                  {agendamento ? (
                    <DraggableAgendamento
                      agendamento={agendamento}
                      updateStatus={updateAgendamentoStatus}
                    />
                  ) : (
                    <div className="h-full border-2 border-dashed border-muted rounded flex items-center justify-center text-muted-foreground text-sm hover:border-primary/50 transition-colors">
                      Disponível
                    </div>
                  )}
                </DroppableTimeSlot>
              );
            })}
          </SortableContext>
        </div>
      ))}
    </div>
  );
}