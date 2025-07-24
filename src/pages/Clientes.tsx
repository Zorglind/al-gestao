import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Phone, Mail, Upload, MessageCircle, Download } from "lucide-react";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { generateClientPDF, processExcelImport, type ClientData } from "@/utils/pdfGenerator";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientes, setClientes] = useState<ClientData[]>([
    { id: 1, nome: "Maria Silva", telefone: "(11) 99999-9999", email: "maria@email.com", servicos: 8, ultimoServico: "2024-01-15" },
    { id: 2, nome: "Ana Santos", telefone: "(11) 88888-8888", email: "ana@email.com", servicos: 5, ultimoServico: "2024-01-10" },
    { id: 3, nome: "Beatriz Costa", telefone: "(11) 77777-7777", email: "beatriz@email.com", servicos: 12, ultimoServico: "2024-01-20" },
  ]);
  const { toast } = useToast();

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDropExcel = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const importedClients = await processExcelImport(file);
        setClientes(prev => [...prev, ...importedClients]);
        
        toast({
          title: "Importação concluída!",
          description: `${importedClients.length} clientes foram importados com sucesso.`,
        });
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Não foi possível processar o arquivo. Verifique o formato.",
          variant: "destructive"
        });
      }
    }
  }, [toast, setClientes]);

  const { getRootProps: getExcelRootProps, getInputProps: getExcelInputProps } = useDropzone({
    onDrop: onDropExcel,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const handleWhatsApp = (cliente: ClientData) => {
    const message = `Olá ${cliente.nome}! Como posso ajudá-lo hoje?`;
    const phoneNumber = cliente.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGeneratePDF = async (cliente: ClientData) => {
    try {
      await generateClientPDF(cliente);
      toast({
        title: "PDF gerado!",
        description: `PDF da ficha de ${cliente.nome} foi baixado.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Clientes</h1>
          <p className="text-muted-foreground">Gerencie a base de clientes Sol Lima</p>
        </div>
        <div className="flex gap-2">
          <div {...getExcelRootProps()}>
            <input {...getExcelInputProps()} />
            <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Importar Excel
            </Button>
          </div>
          <Button variant="default" className="flex items-center gap-2" onClick={() => setShowAddClientModal(true)}>
            <UserPlus className="h-4 w-4" />
            Novo Cliente
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
            <div className="text-2xl font-bold text-primary">{clientes.length}</div>
            <p className="text-sm text-muted-foreground">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">25</div>
            <p className="text-sm text-muted-foreground">Serviços este Mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">8.5</div>
            <p className="text-sm text-muted-foreground">Média de Serviços</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {cliente.telefone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {cliente.email}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {cliente.servicos} serviços
                    </Badge>
                    <Badge variant="secondary">
                      Último: {new Date(cliente.ultimoServico).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleWhatsApp(cliente)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleGeneratePDF(cliente)}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </CardContent>
        </Card>
      )}

      <AddClientModal 
        open={showAddClientModal} 
        onClose={() => setShowAddClientModal(false)} 
      />
    </div>
  );
};

export default Clientes;