import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, Users, Clock, Filter } from "lucide-react";
import { ExportModal } from "@/components/modals/ExportModal";
import { useToast } from "@/hooks/use-toast";

const Exportacoes = () => {
  const { toast } = useToast();
  const [showExportModal, setShowExportModal] = useState(false);
  const [tipoExportacao, setTipoExportacao] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const exportacoes = [
    {
      id: 1,
      tipo: "Clientes",
      arquivo: "clientes_janeiro_2024.pdf",
      data: "2024-01-20",
      tamanho: "2.3 MB",
      status: "Concluído"
    },
    {
      id: 2,
      tipo: "Anamnese",
      arquivo: "fichas_anamnese_semana_03.pdf",
      data: "2024-01-18",
      tamanho: "1.8 MB",
      status: "Concluído"
    },
    {
      id: 3,
      tipo: "Agendamentos",
      arquivo: "agenda_quinzenal.xlsx",
      data: "2024-01-15",
      tamanho: "842 KB",
      status: "Em processamento"
    },
  ];

  const tiposExportacao = [
    { value: "clientes", label: "Cadastro de Clientes" },
    { value: "anamnese", label: "Fichas de Anamnese" },
    { value: "agendamentos", label: "Agendamentos" },
    { value: "servicos", label: "Relatório de Serviços" },
    { value: "financeiro", label: "Relatório Financeiro" },
  ];

  const handleGerarExportacao = () => {
    if (!tipoExportacao) {
      toast({
        title: "Erro!",
        description: "Selecione um tipo de exportação.",
        variant: "destructive",
      });
      return;
    }
    if (!periodo) {
      toast({
        title: "Erro!",
        description: "Selecione um período.",
        variant: "destructive",
      });
      return;
    }

    console.log("Gerar exportação:", { tipoExportacao, periodo, dataInicio, dataFim });
    toast({
      title: "Exportação iniciada!",
      description: `Gerando exportação de ${tiposExportacao.find(t => t.value === tipoExportacao)?.label}. Você será notificado quando estiver pronta.`,
    });
  };

  const handleDownload = (arquivo: string) => {
    console.log("Download:", arquivo);
    toast({
      title: "Download iniciado!",
      description: `${arquivo} está sendo baixado.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Exportações</h1>
          <p className="text-muted-foreground">Exporte relatórios e documentos</p>
        </div>
      </div>

      {/* Formulário de Nova Exportação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Nova Exportação
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar um novo relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Exportação</Label>
              <Select value={tipoExportacao} onValueChange={setTipoExportacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposExportacao.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                  <SelectItem value="personalizado">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {periodo === "personalizado" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="default" className="flex items-center gap-2" onClick={handleGerarExportacao}>
              <Download className="h-4 w-4" />
              Gerar Exportação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{exportacoes.length}</div>
            <p className="text-sm text-muted-foreground">Total de Exportações</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {exportacoes.filter(e => e.status === "Concluído").length}
            </div>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">
              {exportacoes.filter(e => e.status === "Em processamento").length}
            </div>
            <p className="text-sm text-muted-foreground">Em Processamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">5.9 MB</div>
            <p className="text-sm text-muted-foreground">Total de Arquivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Exportações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Exportações
          </CardTitle>
          <CardDescription>
            Visualize e baixe exportações anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportacoes.map((exportacao) => (
              <div 
                key={exportacao.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{exportacao.arquivo}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(exportacao.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span>{exportacao.tamanho}</span>
                      <span className="capitalize">{exportacao.tipo}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={exportacao.status === "Concluído" ? "default" : "secondary"}
                  >
                    {exportacao.status}
                  </Badge>
                  {exportacao.status === "Concluído" && (
                    <Button variant="outline" size="sm" onClick={() => handleDownload(exportacao.arquivo)}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Exportacoes;