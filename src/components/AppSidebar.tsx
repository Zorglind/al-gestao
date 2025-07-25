
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Package,
  Briefcase,
  DollarSign,
  Download,
  User,
  UserPlus,
  BookOpen
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
import logoImage from "@/assets/al-gestao-logo.png";
import { BRAND } from "@/constants/branding";
import * as React from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    permission: "dashboard",
  },
  {
    title: "Profissionais",
    url: "/profissionais",
    icon: UserPlus,
    permission: "profissionais",
  },
  {
    title: "Clientes", 
    url: "/clientes",
    icon: Users,
    permission: "clientes",
  },
  {
    title: "Agenda",
    url: "/agenda", 
    icon: Calendar,
    permission: "agenda",
  },
  {
    title: "Anamnese",
    url: "/anamnese",
    icon: FileText,
    permission: "anamnese",
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: Package,
    permission: "produtos",
  },
  {
    title: "Serviços",
    url: "/servicos", 
    icon: Briefcase,
    permission: "servicos",
  },
  {
    title: "Catálogo",
    url: "/catalogo",
    icon: BookOpen,
    permission: "catalogo",
  },
  {
    title: "Financeiro",
    url: "/financeiro",
    icon: DollarSign,
    permission: "financeiro",
  },
  {
    title: "Exportações", 
    url: "/exportacoes",
    icon: Download,
    permission: "exportacoes",
  },
  {
    title: "Meu Perfil",
    url: "/meu-perfil",
    icon: User,
    permission: "perfil",
  },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasPermission, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile navigation
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

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
              alt={BRAND.name} 
              className="w-10 h-5 object-contain"
            />
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-white">{BRAND.shortName}</h2>
                <p className="text-xs text-slate-300">{BRAND.tagline}</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => hasPermission(item.permission))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/"} 
                        className={getNavCls}
                        onClick={() => {
                          // Auto-collapse on mobile after navigation
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
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
