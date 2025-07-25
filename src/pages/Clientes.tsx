import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Upload, MessageSquare, FileText, User, Trash2, BarChart3, Eye, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { DeleteClientModal } from "@/components/modals/DeleteClientModal";
import { ClientHistoryModal } from "@/components/modals/ClientHistoryModal";
import { ViewClientModal } from "@/components/modals/ViewClientModal";
import { generateClientPDF } from "@/utils/pdfGenerator";
import { clientsService, Client } from "@/services/clientsService";
import * as XLSX from 'xlsx';

export default function Clientes() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Load clients from Supabase
  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (client.phone && client.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === "todos" || 
                         (statusFilter === "ativo" && client.is_active) ||
                         (statusFilter === "inativo" && !client.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Verificar extensão do arquivo
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls).",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['nome', 'telefone', 'email'] });

      // Remove header row if it exists and type the data
      const clientsToImport = jsonData.slice(1).filter((row: any) => 
        row.nome && typeof row.nome === 'string' && row.nome.trim() !== ''
      ) as Array<{nome: string, telefone?: string, email?: string}>;

      if (clientsToImport.length === 0) {
        toast({
          title: "Arquivo vazio",
          description: "Nenhum cliente válido encontrado no arquivo.",
          variant: "destructive",
        });
        return;
      }

      let importedCount = 0;
      let errorCount = 0;

      for (const clientData of clientsToImport) {
        try {
          await clientsService.create({
            name: String(clientData.nome).trim(),
            phone: clientData.telefone ? String(clientData.telefone).trim() : null,
            email: clientData.email ? String(clientData.email).trim() : null,
          });
          importedCount++;
        } catch (error) {
          console.error('Erro ao importar cliente:', clientData, error);
          errorCount++;
        }
      }

      if (importedCount > 0) {
        await loadClients(); // Recarregar lista
        toast({
          title: "Importação concluída com sucesso!",
          description: `${importedCount} cliente(s) adicionado(s) ao sistema!${errorCount > 0 ? ` ${errorCount} erro(s) encontrado(s).` : ''}`,
        });
      } else {
        toast({
          title: "Erro na importação",
          description: "Nenhum cliente pôde ser importado. Verifique o formato do arquivo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o arquivo está no formato correto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: loading
  });

  const handleWhatsApp = (phone: string) => {
    const numeroLimpo = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
  };

  const handleGeneratePDF = (client: Client) => {
    // Convert Client to the format expected by generateClientPDF
    const clientData = {
      id: parseInt(client.id) || 1, // Convert string ID to number for PDF generator
      nome: client.name,
      email: client.email || '',
      telefone: client.phone || '',
      ultimaVisita: client.last_visit || '',
      totalServicos: client.total_services,
      status: client.is_active ? 'ativo' as const : 'inativo' as const,
      servicos: client.total_services,
      ultimoServico: client.last_visit || ''
    };
    generateClientPDF(clientData);
  };

  const toggleClientStatus = async (clientId: string) => {
    try {
      await clientsService.toggleActive(clientId);
      await loadClients(); // Recarregar lista
      toast({
        title: "Status atualizado",
        description: "Status do cliente foi alterado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDeleteClient = async () => {
    if (clientToDelete) {
      try {
        await clientsService.delete(clientToDelete.id);
        await loadClients(); // Recarregar lista
        toast({
          title: "Cliente excluído com sucesso!",
          description: `${clientToDelete.name} foi removido do sistema.`,
        });
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast({
          title: "Erro ao excluir cliente",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      } finally {
        setShowDeleteModal(false);
        setClientToDelete(null);
      }
    }
  };

  const showHistoryModalForClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowHistoryModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie a base de clientes do seu negócio</p>
        </div>
        <div className="flex gap-2">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button variant="outline" disabled={loading} className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {isDragActive ? "Solte o arquivo..." : "Importar Excel"}
            </Button>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              {clients.filter(c => c.is_active).length} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.reduce((total, client) => total + client.total_services, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Serviços realizados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Serviços</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.length > 0 
                ? (clients.reduce((total, client) => total + client.total_services, 0) / clients.length).toFixed(1)
                : '0'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Por cliente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando clientes...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? "Tente ajustar sua busca ou adicionar um novo cliente." : "Comece adicionando seu primeiro cliente."}
                </p>
                <Button 
                  onClick={() => setShowAddModal(true)} 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.avatar_url || ""} />
                        <AvatarFallback>
                          {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{client.name}</h3>
                          <Badge 
                            variant={client.is_active ? 'default' : 'secondary'}
                            onClick={() => toggleClientStatus(client.id)}
                            className="cursor-pointer"
                          >
                            {client.is_active ? '✅ ATIVO' : '🚫 INATIVO'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{client.email || 'Email não informado'}</p>
                          <p>{client.phone || 'Telefone não informado'}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Última visita: {client.last_visit ? new Date(client.last_visit).toLocaleDateString('pt-BR') : 'Nunca'} • 
                          {client.total_services} serviços realizados
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {client.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWhatsApp(client.phone!)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePDF(client)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewClient(client)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showHistoryModalForClient(client.id)}
                      >
                        Histórico
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClient(client)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modais */}
      <AddClientModal 
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onClientAdded={loadClients}
      />
      
      <ViewClientModal
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        client={selectedClient}
      />
      
      <DeleteClientModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteClient}
        clientName={clientToDelete?.name || ''}
      />
      
      <ClientHistoryModal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        clientId={selectedClientId}
      />
    </div>
  );
}