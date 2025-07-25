import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Mail, Key, Users } from "lucide-react";
import { AddProfessionalModal } from "@/components/modals/AddProfessionalModal";
import { PermissionsModal } from "@/components/modals/PermissionsModal";
import { useToast } from "@/hooks/use-toast";

const Profissionais = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const { toast } = useToast();

  const [profissionais, setProfissionais] = useState([
    { 
      id: 1, 
      nome: "Ana Silva", 
      email: "ana@sollima.com.br", 
      especialidade: "Tricologista", 
      status: "Ativo" 
    },
    { 
      id: 2, 
      nome: "Beatriz Santos", 
      email: "bia@sollima.com.br", 
      especialidade: "Cabeleireira", 
      status: "Ativo" 
    },
    { 
      id: 3, 
      nome: "Carol Lima", 
      email: "carol@sollima.com.br", 
      especialidade: "Esteticista", 
      status: "Inativo" 
    },
  ]);

  const filteredProfissionais = profissionais.filter(prof =>
    (prof.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     prof.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenPermissions = (professionalName: string) => {
    setSelectedProfessional(professionalName);
    setIsPermissionsModalOpen(true);
  };

  const toggleProfessionalStatus = (id: number) => {
    setProfissionais(prev => {
      const updated = prev.map(prof => {
        if (prof.id === id) {
          const novoStatus = prof.status === "Ativo" ? "Inativo" : "Ativo";
          toast({
            title: "Status atualizado!",
            description: `${prof.nome} está agora ${novoStatus}.`,
          });
          return { ...prof, status: novoStatus };
        }
        return prof;
      });
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Profissionais</h1>
          <p className="text-muted-foreground">Gerencie a equipe Sol Lima</p>
        </div>
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Adicionar Profissional
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Profissionais */}
      <div className="grid gap-4">
        {filteredProfissionais.map((profissional) => (
          <Card key={profissional.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profissional.nome}</h3>
                      <p className="text-sm text-muted-foreground">{profissional.especialidade}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {profissional.email}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant={profissional.status === "Ativo" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleProfessionalStatus(profissional.id)}
                  >
                    {profissional.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenPermissions(profissional.nome)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Permissões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfissionais.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum profissional encontrado</p>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <AddProfessionalModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <PermissionsModal 
        open={isPermissionsModalOpen} 
        onClose={() => {
          setIsPermissionsModalOpen(false);
          setSelectedProfessional(null);
        }}
        professionalName={selectedProfessional}
      />
    </div>
  );
};

export default Profissionais;
