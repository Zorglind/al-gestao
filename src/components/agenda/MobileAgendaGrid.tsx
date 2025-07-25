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

// Mobile-optimized appointment card with status selector
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
      className={`min-h-[80px] p-2 border rounded transition-colors cursor-grab active:cursor-grabbing ${getStatusBackgroundColor(agendamento.status)} text-white border-transparent shadow-sm`}
    >
      <div className="space-y-1">
        <div className="font-semibold text-white truncate text-sm">
          {agendamento.cliente}
        </div>
        <div className="text-white/90 truncate text-xs">
          {agendamento.horario} - {agendamento.servico}
        </div>
        <Select
          value={agendamento.status}
          onValueChange={(newStatus) => updateStatus(agendamento.id, newStatus)}
        >
          <SelectTrigger className="h-6 text-xs bg-white/20 border-white/30 text-white hover:bg-white/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="realizado">Realizado</SelectItem>
            <SelectItem value="faltou">Faltou</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface MobileAgendaGridProps {
  agendamentos: Agendamento[];
  profissional: string;
  horarios: string[];
  DraggableAgendamento: React.ComponentType<{
    agendamento: Agendamento;
    updateStatus: (id: number, status: string) => void;
  }>;
  updateAgendamentoStatus: (id: number, status: string) => void;
}

export function MobileAgendaGrid({
  agendamentos,
  profissional,
  horarios,
  DraggableAgendamento,
  updateAgendamentoStatus,
}: MobileAgendaGridProps) {
  return (
    <div className="space-y-2">
      {/* Header do Profissional */}
      <div className="p-3 bg-primary text-primary-foreground rounded-lg text-center font-semibold">
        {profissional}
      </div>

      {/* Lista vertical de horários para mobile */}
      <SortableContext
        items={agendamentos.filter(a => a.profissional === profissional).map(a => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {horarios.map((hora) => {
            const agendamento = agendamentos.find(
              a => a.horario === hora && a.profissional === profissional
            );

            return (
              <div key={`${profissional}-${hora}`} className="flex items-start gap-3">
                {/* Horário fixo à esquerda */}
                <div className="w-16 flex-shrink-0 text-sm font-medium text-muted-foreground pt-2">
                  {hora}
                </div>
                
                {/* Slot do agendamento */}
                <DroppableTimeSlot
                  id={`${profissional}-${hora}`}
                  className="flex-1 min-h-[80px]"
                >
                  {agendamento ? (
                    <MobileAppointmentCard
                      agendamento={agendamento}
                      updateStatus={updateAgendamentoStatus}
                    />
                  ) : (
                    <div className="min-h-[80px] border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm hover:border-primary/50 transition-colors">
                      Disponível
                    </div>
                  )}
                </DroppableTimeSlot>
              </div>
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
}