import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Scissors, Plus, Clock, DollarSign, Tag } from "lucide-react";
import { AddServiceModal } from "@/components/modals/AddServiceModal";
import { useToast } from "@/hooks/use-toast";

const Servicos = () => {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const { toast } = useToast();
  const [servicos, setServicos] = useState([
    {
      id: 1,
      nome: "Hidratação Intensiva",
      categoria: "Capilar",
      duracao: 90,
      valor: 120,
      ativo: true,
      descricao: "Tratamento profundo de hidratação para cabelos ressecados"
    },
    {
      id: 2,
      nome: "Corte + Finalização",
      categoria: "Capilar",
      duracao: 60,
      valor: 80,
      ativo: true,
      descricao: "Corte personalizado com finalização"
    },
    {
      id: 3,
      nome: "Cronograma Capilar",
      categoria: "Terapêutico",
      duracao: 120,
      valor: 180,
      ativo: true,
      descricao: "Programa completo de recuperação capilar"
    },
    {
      id: 4,
      nome: "Tratamento Antiqueda",
      categoria: "Terapêutico",
      duracao: 75,
      valor: 150,
      ativo: false,
      descricao: "Tratamento especializado para queda de cabelo"
    },
    {
      id: 5,
      nome: "Relaxamento",
      categoria: "Estética",
      duracao: 45,
      valor: 60,
      ativo: true,
      descricao: "Massagem relaxante no couro cabeludo"
    },
  ]);

  const toggleServico = (id: number) => {
    setServicos(servicos.map(servico => 
      servico.id === id ? { ...servico, ativo: !servico.ativo } : servico
    ));
  };

  const getCategoriaColor = (categoria: string) => {
    const cores = {
      "Capilar": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      "Terapêutico": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      "Estética": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
    };
    return cores[categoria as keyof typeof cores] || "bg-gray-100 text-gray-800";
  };

  const servicosAtivos = servicos.filter(s => s.ativo);
  const valorMedio = servicos.reduce((acc, s) => acc + s.valor, 0) / servicos.length;
  const duracaoMedia = servicos.reduce((acc, s) => acc + s.duracao, 0) / servicos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Serviços</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de serviços Sol Lima</p>
        </div>
        <Button variant="default" className="flex items-center gap-2" onClick={() => setShowAddServiceModal(true)}>
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{servicos.length}</div>
            <p className="text-sm text-muted-foreground">Total de Serviços</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{servicosAtivos.length}</div>
            <p className="text-sm text-muted-foreground">Serviços Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">R$ {valorMedio.toFixed(0)}</div>
            <p className="text-sm text-muted-foreground">Valor Médio</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{duracaoMedia.toFixed(0)}min</div>
            <p className="text-sm text-muted-foreground">Duração Média</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Serviços */}
      <div className="grid gap-4">
        {servicos.map((servico) => (
          <Card key={servico.id} className={`hover:shadow-md transition-shadow ${!servico.ativo ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{servico.nome}</h3>
                      <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <Badge className={getCategoriaColor(servico.categoria)}>
                      <Tag className="h-3 w-3 mr-1" />
                      {servico.categoria}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {servico.duracao} min
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      R$ {servico.valor}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={servico.ativo}
                      onCheckedChange={() => toggleServico(servico.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {servico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Editar Serviço", description: "Modal de edição será implementado em breve." })}>
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddServiceModal 
        open={showAddServiceModal} 
        onClose={() => setShowAddServiceModal(false)} 
      />
    </div>
  );
};

export default Servicos;