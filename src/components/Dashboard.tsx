import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  UserPlus
} from "lucide-react";
import logoImage from "@/assets/sol-lima-logo.jpg";

interface DashboardProps {
  professionalName: string;
  onLogout: () => void;
}

const Dashboard = ({ professionalName, onLogout }: DashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dados mockados para demonstração
  const todayAppointments = [
    { id: 1, client: "Maria Silva", time: "09:00", service: "Hidratação Intensiva", status: "confirmado" },
    { id: 2, client: "Ana Santos", time: "11:30", service: "Corte + Finalização", status: "em-andamento" },
    { id: 3, client: "Beatriz Costa", time: "14:00", service: "Cronograma Capilar", status: "agendado" },
    { id: 4, client: "Julia Oliveira", time: "16:30", service: "Tratamento Antiqueda", status: "agendado" },
  ];

  const stats = {
    todayAppointments: 4,
    monthlyClients: 67,
    pendingConfirmations: 3,
    monthlyRevenue: 8500
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800";
      case "em-andamento": return "bg-blue-100 text-blue-800";
      case "agendado": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-sol-lima-pink/20 to-background">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-sol-lima-pink/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={logoImage} 
              alt="Sol Lima" 
              className="w-12 h-6 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">Sol Lima Tricologia</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Olá, {professionalName}!</p>
              <p className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <Button variant="outline" onClick={onLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Button variant="gold" className="h-16 flex-col">
            <UserPlus className="h-5 w-5 mb-1" />
            Novo Cliente
          </Button>
          <Button variant="elegant" className="h-16 flex-col">
            <CalendarDays className="h-5 w-5 mb-1" />
            Agendar
          </Button>
          <Button variant="soft" className="h-16 flex-col">
            <Search className="h-5 w-5 mb-1" />
            Buscar Cliente
          </Button>
          <Button variant="gold-outline" className="h-16 flex-col">
            <Scissors className="h-5 w-5 mb-1" />
            Serviços
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.todayAppointments}</div>
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
              <div className="text-2xl font-bold text-primary">{stats.monthlyClients}</div>
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
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingConfirmations}</div>
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
              <div className="text-2xl font-bold text-sol-lima-gold">
                R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Agendamentos de Hoje
              </CardTitle>
              <CardDescription>
                Sua agenda para {currentTime.toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-4 border border-sol-lima-pink/30 rounded-lg hover:bg-sol-lima-pink/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{appointment.time}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{appointment.client}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-sol-lima-gold" />
                Informações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-sol-lima-pink/20 to-sol-lima-gold/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">🎉 Parabéns!</h4>
                <p className="text-sm text-muted-foreground">
                  Você superou sua meta mensal de atendimentos!
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Lembretes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Confirmar agendamento de Ana Santos (11h30)</li>
                  <li>• Atualizar ficha de Maria Silva</li>
                  <li>• Revisar estoque de produtos</li>
                </ul>
              </div>

              <Button variant="soft" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
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