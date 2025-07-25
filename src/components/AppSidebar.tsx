
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Scissors, 
  Package, 
  FileText, 
  Download, 
  BarChart3,
  DollarSign,
  User,
  Layers
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import logoImage from "@/assets/sol-lima-logo.jpg";

const menuItems = [
  { title: "Painel", url: "/", icon: BarChart3 },
  { title: "Profissionais", url: "/profissionais", icon: UserCheck },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Serviços", url: "/servicos", icon: Scissors },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Catálogo", url: "/catalogo", icon: Layers },
  { title: "Anamnese", url: "/anamnese", icon: FileText },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Exportações", url: "/exportacoes", icon: Download },
  { title: "Meu Perfil", url: "/meu-perfil", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-white font-medium" 
      : "hover:bg-slate-700 text-slate-200 hover:text-white";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-slate-900 border-r border-slate-700">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Sol Lima" 
              className="w-10 h-5 object-contain"
            />
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-white">Sol Lima</h2>
                <p className="text-xs text-slate-300">Sistema de Gestão</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
