import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import Profissionais from "@/pages/Profissionais";
import Clientes from "@/pages/Clientes";
import Agenda from "@/pages/Agenda";
import Servicos from "@/pages/Servicos";
import Produtos from "@/pages/Produtos";
import Anamnese from "@/pages/Anamnese";
import Catalogo from "@/pages/Catalogo";
import Exportacoes from "@/pages/Exportacoes";
import MeuPerfil from "@/pages/MeuPerfil";
import Financeiro from "@/pages/Financeiro";
import logoImage from "@/assets/al-gestao-logo.png";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { BRAND } from "@/constants/branding";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { user, profile, logout, isAuthenticated, loading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    // This function won't be used since LoginPage handles auth directly
    return true;
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !profile) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isMobile = useIsMobile();

  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-secondary/20 to-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  {!isMobile && (
                    <div className="flex items-center space-x-3">
                      <img 
                        src={logoImage} 
                        alt={BRAND.name} 
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <h1 className="text-lg font-bold text-primary">{BRAND.shortName}</h1>
                        <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {!isMobile && (
                    <div className="text-right mr-3">
                      <p className="text-sm font-medium text-primary flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {profile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile.role === 'admin' ? 'Administrador' : 'Profissional'} • {new Date().toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                  
                  <NotificationDropdown />
                  
                  <Button variant="outline" onClick={handleLogout} size="sm" className="flex items-center gap-1">
                    <LogOut className="h-4 w-4" />
                    {!isMobile && <span>Sair</span>}
                  </Button>
                </div>
              </div>
            </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<DashboardPage professionalName={profile.name} onLogout={handleLogout} />} />
              <Route path="/profissionais" element={<Profissionais />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/anamnese" element={<Anamnese />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/exportacoes" element={<Exportacoes />} />
              <Route path="/meu-perfil" element={<MeuPerfil />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
    </NotificationProvider>
  );
};

export default Index;
