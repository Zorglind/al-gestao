import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const Agenda = () => {
  const [viewMode, setViewMode] = useState("diaria");
  const [selectedProfessional, setSelectedProfessional] = useState("todos");
  const [currentDate, setCurrentDate] = useState(new Date());

  const agendamentos = [
    {
      id: 1,
      cliente: "Maria Silva",
      profissional: "Ana Silva",
      servico: "Hidratação Intensiva",
      horario: "09:00",
      status: "confirmado",
      data: "2024-01-23"
    },
    {
      id: 2,
      cliente: "Ana Santos",
      profissional: "Beatriz Santos",
      servico: "Corte + Finalização",
      horario: "11:30",
      status: "em-andamento",
      data: "2024-01-23"
    },
    {
      id: 3,
      cliente: "Beatriz Costa",
      profissional: "Ana Silva",
      servico: "Cronograma Capilar",
      horario: "14:00",
      status: "agendado",
      data: "2024-01-23"
    },
    {
      id: 4,
      cliente: "Julia Oliveira",
      profissional: "Carol Lima",
      servico: "Tratamento Antiqueda",
      horario: "16:30",
      status: "cancelado",
      data: "2024-01-23"
    },
  ];

  const getStatusColor = (status: string) => {
    const statusMap = {
      "confirmado": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      "em-andamento": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      "agendado": "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      "cancelado": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      "realizado": "bg-primary/10 text-primary",
      "faltou": "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    };
    return statusMap[status as keyof typeof statusMap] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      "confirmado": "Confirmado",
      "em-andamento": "Em Andamento",
      "agendado": "Agendado",
      "cancelado": "Cancelado",
      "realizado": "Realizado",
      "faltou": "Faltou"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Agenda</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos da equipe</p>
        </div>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
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
                  <SelectItem value="ana">Ana Silva</SelectItem>
                  <SelectItem value="beatriz">Beatriz Santos</SelectItem>
                  <SelectItem value="carol">Carol Lima</SelectItem>
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
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-sm text-muted-foreground">Agendamentos Hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-sm text-muted-foreground">Confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-sm text-muted-foreground">Cancelados</p>
          </CardContent>
        </Card>
      </div>

      {/* Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamentos do Dia
          </CardTitle>
          <CardDescription>
            {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agendamentos.map((agendamento) => (
              <div 
                key={agendamento.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{agendamento.horario}</div>
                    <Clock className="h-4 w-4 text-muted-foreground mx-auto" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{agendamento.cliente}</h4>
                    <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {agendamento.profissional}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(agendamento.status)}>
                  {getStatusText(agendamento.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;