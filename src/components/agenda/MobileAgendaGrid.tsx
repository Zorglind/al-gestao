import { useState } from "react";
import { User } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DroppableTimeSlot } from "./DroppableTimeSlot";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  horario: string;
  status: string;
  data: string;
}

// Mobile-optimized appointment card
function MobileAppointmentCard({ agendamento, updateStatus }: { agendamento: Agendamento; updateStatus: (id: number, status: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: agendamento.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-500";
      case "realizado": return "bg-blue-500";
      case "agendado": return "bg-yellow-500";
      case "faltou": return "bg-red-500";
      case "cancelado": return "bg-gray-500";
      default: return "bg-gray-100";
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`h-12 p-1 border rounded transition-colors cursor-grab active:cursor-grabbing ${getStatusBackgroundColor(agendamento.status)} text-white border-transparent`}
    >
      <div className="text-xs">
        <div className="font-semibold text-white truncate text-xs">
          {agendamento.cliente}
        </div>
        <div className="text-white/90 truncate text-xs">
          {agendamento.horario} - {agendamento.servico}
        </div>
      </div>
    </div>
  );
}

interface MobileAgendaGridProps {
  agendamentos: Agendamento[];
  profissionais: string[];
  horarios: string[];
  DraggableAgendamento: React.ComponentType<{
    agendamento: Agendamento;
    updateStatus: (id: number, status: string) => void;
  }>;
  updateAgendamentoStatus: (id: number, status: string) => void;
}

export function MobileAgendaGrid({
  agendamentos,
  profissionais,
  horarios,
  DraggableAgendamento,
  updateAgendamentoStatus,
}: MobileAgendaGridProps) {
  return (
    <div className="flex overflow-x-auto">
      {/* Coluna de Horários Fixa */}
      <div className="sticky left-0 z-10 bg-background border-r border-border">
        <div className="w-20 h-12 flex items-center justify-center font-semibold text-xs bg-muted border-b">
          Horário
        </div>
        {horarios.map((hora) => (
          <div
            key={hora}
            className="w-20 h-12 flex items-center justify-center text-xs text-muted-foreground border-b bg-background"
          >
            {hora}
          </div>
        ))}
      </div>

      {/* Colunas dos Profissionais */}
      <div className="flex">
        {profissionais.map((profissional) => (
          <div key={profissional} className="min-w-[200px] border-r border-border">
            <div className="h-12 flex items-center justify-center font-semibold text-xs bg-primary text-primary-foreground border-b px-2">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate">{profissional}</span>
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
                    className={`border-b h-12 ${!agendamento ? 'p-1 hover:bg-muted/50' : ''}`}
                  >
                    {agendamento ? (
                      <MobileAppointmentCard
                        agendamento={agendamento}
                        updateStatus={updateAgendamentoStatus}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-muted-foreground text-xs">
                        Livre
                      </div>
                    )}
                  </DroppableTimeSlot>
                );
              })}
            </SortableContext>
          </div>
        ))}
      </div>
    </div>
  );
}