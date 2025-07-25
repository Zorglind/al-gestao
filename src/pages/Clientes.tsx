import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Upload, UserPlus, MessageCircle, FileText, Users, Calendar, TrendingUp, Trash2, History } from "lucide-react";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { DeleteClientModal } from "@/components/modals/DeleteClientModal";
import { ClientHistoryModal } from "@/components/modals/ClientHistoryModal";
import { useDropzone } from 'react-dropzone';
import { generateClientPDF } from '@/utils/pdfGenerator';
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  ultimaVisita: string;
  totalServicos: number;
  status: 'ATIVO' | 'INATIVO';
}

const Clientes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClientHistoryModal, setShowClientHistoryModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);

  const [clientes, setClientes] = useState<ClientData[]>([
    { id: 1, nome: "Maria Silva", email: "maria@email.com", telefone: "(11) 99999-9999", ultimaVisita: "2024-01-15", totalServicos: 8, status: 'ATIVO' },
    { id: 2, nome: "Ana Santos", email: "ana@email.com", telefone: "(11) 88888-8888", ultimaVisita: "2024-01-12", totalServicos: 12, status: 'ATIVO' },
    { id: 3, nome: "Beatriz Costa", email: "beatriz@email.com", telefone: "(11) 77777-7777", ultimaVisita: "2024-01-10", totalServicos: 5, status: 'INATIVO' },
    { id: 4, nome: "Julia Oliveira", email: "julia@email.com", telefone: "(11) 66666-6666", ultimaVisita: "2024-01-08", totalServicos: 15, status: 'ATIVO' },
    { id: 5, nome: "Fernanda Rocha", email: "fernanda@email.com", telefone: "(11) 55555-5555", ultimaVisita: "2024-01-05", totalServicos: 3, status: 'ATIVO' },
  ]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para processar importação de Excel (mock)
  const processExcelImport = async (file: File): Promise<ClientData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: Date.now(), nome: "Cliente Importado", email: "importado@exemplo.com", telefone: "(11) 00000-0000", ultimaVisita: new Date().toISOString().split('T')[0], totalServicos: 0, status: 'ATIVO' }
        ]);
      }, 1000);
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const importedClients = await processExcelImport(file);
        setClientes(prev => [...prev, ...importedClients]);
        toast({
          title: "Importação concluída!",
          description: `${importedClients.length} clientes foram importados.`,
        });
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Não foi possível processar o arquivo.",
          variant: "destructive"
        });
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const handleWhatsApp = (telefone: string) => {
    const phoneNumber = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phoneNumber}`, '_blank');
  };

  const handleGeneratePDF = async (client: ClientData) => {
    try {
      // Adapt ClientData to match pdfGenerator interface
      const pdfClient = {
        ...client,
        servicos: client.totalServicos,
        ultimoServico: client.ultimaVisita
      };
      await generateClientPDF(pdfClient);
      toast({
        title: "PDF gerado com sucesso!",
        description: `Relatório de ${client.nome} foi baixado.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    }
  };

  const toggleClientStatus = (clientId: number) => {
    setClientes(clientes.map(client => {
      if (client.id === clientId) {
        const newStatus = client.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        toast({
          title: "Status alterado!",
          description: `${client.nome} agora está ${newStatus}.`,
        });
        return { ...client, status: newStatus };
      }
      return client;
    }));
  };

  const handleDeleteClient = (client: ClientData) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      setClientes(clientes.filter(c => c.id !== clientToDelete.id));
      toast({
        title: "Cliente excluído!",
        description: `${clientToDelete.nome} foi removido do sistema.`,
      });
      setClientToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Clientes</h1>
          <p className="text-muted-foreground">Gerencie a base de clientes</p>
        </div>
        <div className="flex gap-2">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Importar Excel
            </Button>
          </div>
          <Button onClick={() => setShowAddClientModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">{clientes.length}</div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {clientes.reduce((acc, cliente) => acc + cliente.totalServicos, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Serviços este Mês</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {(clientes.reduce((acc, cliente) => acc + cliente.totalServicos, 0) / clientes.length).toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Média de Serviços</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <div className="space-y-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{cliente.telefone}</span>
                        <span>{cliente.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={cliente.status === 'ATIVO' ? 'default' : 'secondary'}
                      className={cliente.status === 'ATIVO' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                    >
                      {cliente.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {cliente.totalServicos} serviços
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Switch
                        checked={cliente.status === 'ATIVO'}
                        onCheckedChange={() => toggleClientStatus(cliente.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <span className={`text-sm font-medium ${cliente.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'}`}>
                        {cliente.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Última visita: {new Date(cliente.ultimaVisita).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleWhatsApp(cliente.telefone)} 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button 
                        onClick={() => handleGeneratePDF(cliente)} 
                        variant="outline" 
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedClientId(cliente.id.toString());
                          setShowClientHistoryModal(true);
                        }}
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <History className="h-4 w-4 mr-1" />
                        Histórico
                      </Button>
                    </div>
                    <Button 
                      onClick={() => handleDeleteClient(cliente)} 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </CardContent>
        </Card>
      )}

      <AddClientModal 
        open={showAddClientModal} 
        onClose={() => setShowAddClientModal(false)} 
      />
      
      <DeleteClientModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteClient}
        clientName={clientToDelete?.nome || ""}
      />
      
      <ClientHistoryModal
        open={showClientHistoryModal}
        onClose={() => {
          setShowClientHistoryModal(false);
          setSelectedClientId(null);
        }}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default Clientes;