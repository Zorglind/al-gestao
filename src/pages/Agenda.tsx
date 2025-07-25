import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileAgendaGrid } from "@/components/agenda/MobileAgendaGrid";
import { DesktopAgendaGrid } from "@/components/agenda/DesktopAgendaGrid";
import { AgendaProvider, useAgenda } from "@/contexts/AgendaContext";

// Interface para agendamentos
interface Agendamento {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  horario: string;
  status: string;
  data: string;
}

// Componente para agendamento arrastável
function DraggableAgendamento({ agendamento, updateStatus }: { agendamento: Agendamento; updateStatus: (id: number, status: string) => void }) {
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
      className={`h-16 p-2 border rounded transition-colors cursor-grab active:cursor-grabbing ${getStatusBackgroundColor(agendamento.status)} text-white border-transparent shadow-sm hover:shadow-md`}
    >
      <div className="text-xs space-y-1">
        <div className="font-semibold text-white truncate">
          {agendamento.cliente}
        </div>
        <div className="text-white/90 truncate">
          {agendamento.horario} - {agendamento.servico}
        </div>
        <Select
          value={agendamento.status}
          onValueChange={(newStatus) => updateStatus(agendamento.id, newStatus)}
        >
          <SelectTrigger className="h-5 text-xs bg-white/20 border-white/30 text-white hover:bg-white/30">
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

const AgendaContent = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState("diaria");
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [novoAgendamento, setNovoAgendamento] = useState({
    cliente: "",
    profissional: "",
    servico: "",
    data: "",
    horario: "",
    status: "agendado"
  });

  // Dados mockados dos agendamentos
  const [agendamentos, setAgendamentos] = useState([
    { id: 1, cliente: "Maria Silva", servico: "Hidratação", profissional: "Ana Santos", horario: "09:00", status: "confirmado", data: currentDate.toISOString().split('T')[0] },
    { id: 2, cliente: "Beatriz Costa", servico: "Corte", profissional: "Carlos Lima", horario: "10:00", status: "confirmado", data: currentDate.toISOString().split('T')[0] },
    { id: 3, cliente: "Julia Oliveira", servico: "Cronograma", profissional: "Ana Santos", horario: "11:00", status: "realizado", data: currentDate.toISOString().split('T')[0] },
    { id: 4, cliente: "Fernanda Rocha", servico: "Tratamento", profissional: "Carlos Lima", horario: "14:00", status: "agendado", data: currentDate.toISOString().split('T')[0] },
    { id: 5, cliente: "Patricia Nunes", servico: "Hidratação", profissional: "Ana Santos", horario: "15:00", status: "faltou", data: currentDate.toISOString().split('T')[0] },
    { id: 6, cliente: "Camila Torres", servico: "Corte", profissional: "Carlos Lima", horario: "16:00", status: "cancelado", data: currentDate.toISOString().split('T')[0] }
  ]);

  const profissionais = ["Ana Santos", "Carlos Lima"];
  
  // Gerar horários de 30 em 30 minutos de 08:00 às 19:00
  const horarios = [];
  for (let h = 8; h < 19; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      horarios.push(hora);
    }
  }

  const filteredAgendamentos = selectedProfessional
    ? agendamentos.filter(a => a.profissional === selectedProfessional)
    : [];

  const stats = {
    total: agendamentos.length,
    confirmados: agendamentos.filter(a => a.status === "confirmado").length,
    realizados: agendamentos.filter(a => a.status === "realizado").length,
    cancelados: agendamentos.filter(a => a.status === "cancelado").length,
    faltaram: agendamentos.filter(a => a.status === "faltou").length
  };

  const adicionarAgendamento = () => {
    console.log("Novo agendamento:", novoAgendamento);
    setNovoAgendamento({ cliente: "", profissional: "", servico: "", data: "", horario: "", status: "agendado" });
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado": return "Confirmado";
      case "realizado": return "Realizado";
      case "agendado": return "Agendado";
      case "faltou": return "Faltou";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  // Sensors para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as number;
    const overId = over.id;
    
    // Se foi solto em um slot de horário diferente
    if (typeof overId === 'string' && overId.includes('-')) {
      const [profissional, horario] = overId.split('-');
      
      setAgendamentos(prev => 
        prev.map(agendamento => 
          agendamento.id === activeId 
            ? { ...agendamento, profissional, horario }
            : agendamento
        )
      );
      
      const agendamento = agendamentos.find(a => a.id === activeId);
      if (agendamento) {
        toast({
          title: "Agendamento movido!",
          description: `${agendamento.cliente} foi reagendado para ${horario} com ${profissional}.`,
        });
      }
    }
  };

  const updateAgendamentoStatus = (agendamentoId: number, newStatus: string) => {
    setAgendamentos(prev => 
      prev.map(agendamento => 
        agendamento.id === agendamentoId 
          ? { ...agendamento, status: newStatus }
          : agendamento
      )
    );
    
    const agendamento = agendamentos.find(a => a.id === agendamentoId);
    if (agendamento) {
      toast({
        title: "Status atualizado!",
        description: `${agendamento.cliente} está agora ${newStatus}.`,
      });
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Agenda</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos da equipe</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    placeholder="Nome do cliente"
                    value={novoAgendamento.cliente}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, cliente: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profissional">Profissional</Label>
                  <Select 
                    value={novoAgendamento.profissional} 
                    onValueChange={(value) => setNovoAgendamento({...novoAgendamento, profissional: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionais.map((prof) => (
                        <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servico">Serviço</Label>
                  <Input
                    id="servico"
                    placeholder="Tipo de serviço"
                    value={novoAgendamento.servico}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, servico: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novoAgendamento.data}
                      onChange={(e) => setNovoAgendamento({...novoAgendamento, data: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Select 
                      value={novoAgendamento.horario} 
                      onValueChange={(value) => setNovoAgendamento({...novoAgendamento, horario: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {horarios.map((hora) => (
                          <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={adicionarAgendamento} className="w-full">
                  Agendar Serviço
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Visualização</label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Profissional</label>
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ana Santos">Ana Santos</SelectItem>
                  <SelectItem value="Carlos Lima">Carlos Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Navegação</label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(newDate.getDate() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-center flex-1">
                  {currentDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/(\w+),\s*(\d+)\/(\d+)\/(\d+)/, '$1, $2/$3/$4')}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(newDate.getDate() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Agendamentos Hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.confirmados}</div>
            <p className="text-sm text-muted-foreground">Confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.realizados}</div>
            <p className="text-sm text-muted-foreground">Realizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.faltaram}</div>
            <p className="text-sm text-muted-foreground">Faltaram</p>
          </CardContent>
        </Card>
      </div>

      {/* Agenda Visual Tipo Calendário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda Visual - {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long',
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            }).replace(/(\w+),\s*(\d+)\/(\d+)\/(\d+)/, '$1, $2/$3/$4')}
          </CardTitle>
          <CardDescription>
            Visualização por horário e profissional
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedProfessional ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Selecione um profissional
              </h3>
              <p className="text-sm text-muted-foreground">
                Escolha um profissional nos filtros acima para visualizar a agenda
              </p>
            </div>
          ) : isMobile ? (
            <MobileAgendaGrid
              agendamentos={filteredAgendamentos}
              profissional={selectedProfessional}
              horarios={horarios}
              DraggableAgendamento={DraggableAgendamento}
              updateAgendamentoStatus={updateAgendamentoStatus}
            />
          ) : (
            <DesktopAgendaGrid
              agendamentos={filteredAgendamentos}
              profissionais={[selectedProfessional]}
              horarios={horarios}
              DraggableAgendamento={DraggableAgendamento}
              updateAgendamentoStatus={updateAgendamentoStatus}
            />
          )}
        </CardContent>
      </Card>
      </div>
    </DndContext>
  );
};

const Agenda = () => {
  return (
    <AgendaProvider>
      <AgendaContent />
    </AgendaProvider>
  );
};

export default Agenda;