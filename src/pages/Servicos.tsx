import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Scissors, Plus, Clock, DollarSign, Tag, Loader2 } from "lucide-react";
import { AddServiceModal } from "@/components/modals/AddServiceModal";
import { EditServiceModal } from "@/components/modals/EditServiceModal";
import { useToast } from "@/hooks/use-toast";
import { servicesService, Service } from '@/services/servicesService';
import { useAuth } from '@/contexts/AuthContext';

const Servicos = () => {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Erro ao carregar serviços",
        description: "Não foi possível carregar a lista de serviços.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadServices();
    }
  }, [isAuthenticated]);

  const handleAddService = () => {
    loadServices(); // Reload services after adding
    setShowAddServiceModal(false);
  };

  const handleEditService = () => {
    loadServices(); // Reload services after editing
    setShowEditServiceModal(false);
    setSelectedService(null);
  };

  const toggleService = async (id: string) => {
    try {
      await servicesService.toggleActive(id);
      await loadServices(); // Reload to get updated data
      toast({
        title: "Status atualizado",
        description: "O status do serviço foi alterado com sucesso."
      });
    } catch (error) {
      console.error('Error toggling service:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do serviço.",
        variant: "destructive"
      });
    }
  };

  const getCategoriaColor = (categoria: string) => {
    const cores = {
      "Capilar": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      "Terapêutico": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      "Estética": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
    };
    return cores[categoria as keyof typeof cores] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Serviços</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de serviços Sol Lima</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando serviços...</p>
          </div>
        </div>
      </div>
    );
  }

  const servicosAtivos = services.filter(s => s.is_active);
  const valorMedio = services.length > 0 ? services.reduce((acc, s) => acc + Number(s.price), 0) / services.length : 0;
  const duracaoMedia = services.length > 0 ? services.reduce((acc, s) => acc + s.duration, 0) / services.length : 0;

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
            <div className="text-2xl font-bold text-primary">{services.length}</div>
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
      {services.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum serviço cadastrado</h3>
            <p className="text-muted-foreground mb-4">Comece criando seu primeiro serviço</p>
            <Button onClick={() => setShowAddServiceModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className={`hover:shadow-md transition-shadow ${!service.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Scissors className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <Badge className={getCategoriaColor(service.category)}>
                        <Tag className="h-3 w-3 mr-1" />
                        {service.category}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {service.duration} min
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        R$ {Number(service.price).toFixed(2)}
                      </div>
                      
                      {service.commission_percentage && service.commission_percentage > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Comissão: {service.commission_percentage}%
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={service.is_active}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {service.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedService(service);
                      setShowEditServiceModal(true);
                    }}>
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddServiceModal 
        open={showAddServiceModal} 
        onClose={() => setShowAddServiceModal(false)}
      />
      
      <EditServiceModal 
        open={showEditServiceModal} 
        onClose={() => {
          setShowEditServiceModal(false);
          setSelectedService(null);
        }}
        service={selectedService ? {
          id: parseInt(selectedService.id),
          nome: selectedService.name,
          categoria: selectedService.category,
          duracao: selectedService.duration,
          valor: Number(selectedService.price),
          ativo: selectedService.is_active,
          descricao: selectedService.description || ''
        } : null}
      />
    </div>
  );
};

export default Servicos;