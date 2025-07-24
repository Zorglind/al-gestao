import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const { toast } = useToast();
  const [exportData, setExportData] = useState({
    tipoExportacao: "",
    cliente: "",
    incluirLogo: true,
    incluirAssinatura: true
  });

  const tiposExportacao = [
    { value: "anamnese", label: "Ficha de Anamnese" },
    { value: "cadastro", label: "Cadastro do Cliente" },
    { value: "servico", label: "Dados do Serviço" },
    { value: "completo", label: "Relatório Completo" }
  ];

  const clientes = [
    "Maria Silva",
    "João Santos", 
    "Ana Costa",
    "Pedro Oliveira",
    "Carla Rodrigues"
  ];

  const handleExport = () => {
    if (!exportData.tipoExportacao || !exportData.cliente) {
      toast({
        title: "Erro de validação",
        description: "Selecione o tipo de exportação e o cliente.",
        variant: "destructive"
      });
      return;
    }

    // Simular geração do PDF
    console.log("Exportando:", exportData);
    
    toast({
      title: "PDF Gerado!",
      description: `${exportData.tipoExportacao} de ${exportData.cliente} foi exportado com sucesso.`,
    });

    // Simular download do arquivo
    setTimeout(() => {
      const filename = `${exportData.tipoExportacao}_${exportData.cliente.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      toast({
        title: "Download iniciado",
        description: `Arquivo: ${filename}`,
      });
    }, 1000);

    setExportData({
      tipoExportacao: "",
      cliente: "",
      incluirLogo: true,
      incluirAssinatura: true
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Exportar em PDF</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoExportacao">Tipo de Exportação *</Label>
            <Select value={exportData.tipoExportacao} onValueChange={(value) => setExportData({...exportData, tipoExportacao: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposExportacao.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {tipo.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente *</Label>
            <Select value={exportData.cliente} onValueChange={(value) => setExportData({...exportData, cliente: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente} value={cliente}>{cliente}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="incluirLogo"
                checked={exportData.incluirLogo}
                onCheckedChange={(checked) => setExportData({...exportData, incluirLogo: checked as boolean})}
              />
              <Label htmlFor="incluirLogo" className="text-sm">
                Incluir logotipo da Sol Lima Tricologia
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="incluirAssinatura"
                checked={exportData.incluirAssinatura}
                onCheckedChange={(checked) => setExportData({...exportData, incluirAssinatura: checked as boolean})}
              />
              <Label htmlFor="incluirAssinatura" className="text-sm">
                Incluir espaço para assinatura
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}