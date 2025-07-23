
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profissionais from "./pages/Profissionais";
import Clientes from "./pages/Clientes";
import Agenda from "./pages/Agenda";
import Servicos from "./pages/Servicos";
import Produtos from "./pages/Produtos";
import Anamnese from "./pages/Anamnese";
import Exportacoes from "./pages/Exportacoes";
import MeuPerfil from "./pages/MeuPerfil";
import Financeiro from "./pages/Financeiro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="profissionais" element={<Profissionais />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="servicos" element={<Servicos />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="anamnese" element={<Anamnese />} />
            <Route path="exportacoes" element={<Exportacoes />} />
            <Route path="meu-perfil" element={<MeuPerfil />} />
            <Route path="financeiro" element={<Financeiro />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
