import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

const Agenda = () => {
  const [viewMode, setViewMode] = useState("diaria");
  const [selectedProfessional, setSelectedProfessional] = useState("todos");
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
  const agendamentos = [
    { id: 1, cliente: "Maria Silva", servico: "Hidratação", profissional: "Ana Santos", horario: "09:00", status: "confirmado", data: currentDate.toISOString().split('T')[0] },
    { id: 2, cliente: "Beatriz Costa", servico: "Corte", profissional: "Carlos Lima", horario: "10:00", status: "confirmado", data: currentDate.toISOString().split('T')[0] },
    { id: 3, cliente: "Julia Oliveira", servico: "Cronograma", profissional: "Ana Santos", horario: "11:00", status: "em-andamento", data: currentDate.toISOString().split('T')[0] },
    { id: 4, cliente: "Fernanda Rocha", servico: "Tratamento", profissional: "Carlos Lima", horario: "14:00", status: "agendado", data: currentDate.toISOString().split('T')[0] },
    { id: 5, cliente: "Patricia Nunes", servico: "Hidratação", profissional: "Ana Santos", horario: "15:00", status: "agendado", data: currentDate.toISOString().split('T')[0] },
    { id: 6, cliente: "Camila Torres", servico: "Corte", profissional: "Carlos Lima", horario: "16:00", status: "cancelado", data: currentDate.toISOString().split('T')[0] }
  ];

  const profissionais = ["Ana Santos", "Carlos Lima"];
  const horarios = Array.from({ length: 13 }, (_, i) => {
    const hora = 7 + i;
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  const filteredAgendamentos = selectedProfessional === "todos" 
    ? agendamentos 
    : agendamentos.filter(a => a.profissional === selectedProfessional);

  const stats = {
    total: agendamentos.length,
    confirmados: agendamentos.filter(a => a.status === "confirmado").length,
    emAndamento: agendamentos.filter(a => a.status === "em-andamento").length,
    cancelados: agendamentos.filter(a => a.status === "cancelado").length
  };

  const adicionarAgendamento = () => {
    console.log("Novo agendamento:", novoAgendamento);
    setNovoAgendamento({ cliente: "", profissional: "", servico: "", data: "", horario: "", status: "agendado" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "em-andamento": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "agendado": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "cancelado": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado": return "Confirmado";
      case "em-andamento": return "Em Andamento";
      case "agendado": return "Agendado";
      case "cancelado": return "Cancelado";
      default: return status;
    }
  };

  return (
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
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Ana Santos">Ana Santos</SelectItem>
                  <SelectItem value="Carlos Lima">Carlos Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Navegação</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm text-center flex-1">
                  {currentDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <Button variant="outline" size="sm">
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
            <div className="text-2xl font-bold text-blue-600">{stats.emAndamento}</div>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelados}</div>
            <p className="text-sm text-muted-foreground">Cancelados</p>
          </CardContent>
        </Card>
      </div>

      {/* Agenda Visual Tipo Calendário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda Visual - {currentDate.toLocaleDateString('pt-BR')}
          </CardTitle>
          <CardDescription>
            Visualização por horário e profissional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_1fr] gap-4">
            {/* Coluna de Horários */}
            <div className="space-y-2">
              <div className="h-12 flex items-center justify-center font-semibold text-sm bg-muted rounded">
                Horário
              </div>
              {horarios.map((hora) => (
                <div key={hora} className="h-16 flex items-center justify-center text-sm text-muted-foreground border rounded">
                  {hora}
                </div>
              ))}
            </div>

            {/* Colunas dos Profissionais */}
            {profissionais.map((profissional) => (
              <div key={profissional} className="space-y-2">
                <div className="h-12 flex items-center justify-center font-semibold text-sm bg-primary text-primary-foreground rounded">
                  <User className="h-4 w-4 mr-2" />
                  {profissional}
                </div>
                {horarios.map((hora) => {
                  const agendamento = agendamentos.find(
                    a => a.horario === hora && a.profissional === profissional
                  );
                  
                  return (
                    <div 
                      key={`${profissional}-${hora}`} 
                      className={`h-16 p-2 border rounded transition-colors cursor-pointer hover:bg-muted/50 ${
                        agendamento 
                          ? agendamento.status === 'confirmado' 
                            ? 'bg-green-100 border-green-300 hover:bg-green-200' 
                            : agendamento.status === 'em-andamento'
                            ? 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                            : agendamento.status === 'cancelado'
                            ? 'bg-red-100 border-red-300 hover:bg-red-200'
                            : 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {agendamento ? (
                        <div className="text-xs">
                          <div className="font-semibold text-gray-800 truncate">
                            {agendamento.cliente}
                          </div>
                          <div className="text-gray-600 truncate">
                            {agendamento.servico}
                          </div>
                          <Badge 
                            className={`mt-1 text-xs ${getStatusColor(agendamento.status)}`}
                          >
                            {getStatusText(agendamento.status)}
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-xs">
                          Disponível
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;