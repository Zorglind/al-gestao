import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  Plus, 
  Search,
  Bell,
  LogOut,
  Scissors,
  TrendingUp,
  CalendarDays,
  UserPlus,
  User,
  Target,
  Edit3,
  X
} from "lucide-react";
import { BRAND } from "@/constants/branding";
import { useNotifications } from "@/contexts/NotificationContext";

interface DashboardProps {
  professionalName: string;
  onLogout: () => void;
}

const Dashboard = ({ professionalName, onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [novoLembrete, setNovoLembrete] = useState("");
  const [currentTime] = useState(new Date());
  
  // Estados para modais
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    email: "",
    profissao: ""
  });
  const [novoAgendamento, setNovoAgendamento] = useState({
    cliente: "",
    servico: "",
    data: "",
    horario: ""
  });

  // Dados mockados para demonstração
  const agendamentosHoje = [
    { id: 1, cliente: "Maria Silva", horario: "09:00", servico: "Hidratação Intensiva", status: "confirmado" },
    { id: 2, cliente: "Ana Santos", horario: "11:30", servico: "Corte + Finalização", status: "em-andamento" },
    { id: 3, cliente: "Beatriz Costa", horario: "14:00", servico: "Cronograma Capilar", status: "agendado" },
    { id: 4, cliente: "Julia Oliveira", horario: "16:30", servico: "Tratamento Antiqueda", status: "agendado" },
  ];

  const stats = {
    agendamentosHoje: 4,
    clientesMes: 67,
    confirmacoesaPendentes: 3,
    faturamentoMensal: 8500
  };

  const adicionarLembrete = () => {
    if (novoLembrete.trim()) {
      addNotification(novoLembrete);
      setNovoLembrete("");
    }
  };

  const removerLembrete = (index: number) => {
    removeNotification(index);
  };

  const cadastrarCliente = () => {
    console.log("Novo cliente:", novoCliente);
    setNovoCliente({ nome: "", telefone: "", email: "", profissao: "" });
  };

  const criarAgendamento = () => {
    console.log("Novo agendamento:", novoAgendamento);
    setNovoAgendamento({ cliente: "", servico: "", data: "", horario: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "em-andamento": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "agendado": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado": return "Confirmado";
      case "em-andamento": return "Em Andamento";
      case "agendado": return "Agendado";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Botões de Ação Rápida do Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="h-16 flex-col space-y-1 text-primary-foreground">
                <UserPlus className="h-5 w-5" />
                <span className="text-sm font-medium">Novo Cliente</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome completo"
                    value={novoCliente.nome}
                    onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    placeholder="Profissão do cliente"
                    value={novoCliente.profissao}
                    onChange={(e) => setNovoCliente({...novoCliente, profissao: e.target.value})}
                  />
                </div>
                <Button onClick={cadastrarCliente} className="w-full">
                  Cadastrar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="h-16 flex-col space-y-1 text-primary-foreground">
                <CalendarDays className="h-5 w-5" />
                <span className="text-sm font-medium">Agendar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select value={novoAgendamento.cliente} onValueChange={(value) => setNovoAgendamento({...novoAgendamento, cliente: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria">Maria Silva</SelectItem>
                      <SelectItem value="ana">Ana Santos</SelectItem>
                      <SelectItem value="beatriz">Beatriz Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servico">Serviço</Label>
                  <Select value={novoAgendamento.servico} onValueChange={(value) => setNovoAgendamento({...novoAgendamento, servico: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hidratacao">Hidratação Intensiva</SelectItem>
                      <SelectItem value="corte">Corte + Finalização</SelectItem>
                      <SelectItem value="cronograma">Cronograma Capilar</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input
                      id="horario"
                      type="time"
                      value={novoAgendamento.horario}
                      onChange={(e) => setNovoAgendamento({...novoAgendamento, horario: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={criarAgendamento} className="w-full">
                  Criar Agendamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="h-16 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center space-y-1">
                  <Search className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Buscar Cliente</span>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Buscar Cliente</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="busca">Digite o nome do cliente</Label>
                  <Input
                    id="busca"
                    placeholder="Nome, telefone ou e-mail"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="h-16 flex-col space-y-1"
            onClick={() => navigate('/servicos')}
          >
            <Scissors className="h-5 w-5" />
            <span className="text-sm font-medium">Serviços</span>
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.agendamentosHoje}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes no Mês</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.clientesMes}</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmações Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.confirmacoesaPendentes}</div>
              <p className="text-xs text-muted-foreground">
                Requer atenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                R$ {stats.faturamentoMensal.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agendamentos do Dia */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Agendamentos do Dia
              </CardTitle>
              <CardDescription>
                Sua agenda para {currentTime.toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentosHoje.map((agendamento) => (
                  <div 
                    key={agendamento.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{agendamento.horario}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{agendamento.cliente}</h4>
                        <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
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

          {/* Informações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Informações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mensagem de Status */}
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Parabéns!
                </h4>
                <p className="text-sm text-muted-foreground">
                  Você bateu sua meta mensal de atendimentos!
                </p>
              </div>
              
              {/* Lista de Lembretes Editável */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Lembretes</h4>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                      <span className="text-muted-foreground">{notification}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerLembrete(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Adicionar novo lembrete */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Adicionar novo lembrete..."
                    value={novoLembrete}
                    onChange={(e) => setNovoLembrete(e.target.value)}
                    className="min-h-[60px] text-sm"
                  />
                  <Button 
                    onClick={adicionarLembrete} 
                    size="sm" 
                    className="w-full"
                    disabled={!novoLembrete.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Lembrete
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Ver Todas as Notificações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;