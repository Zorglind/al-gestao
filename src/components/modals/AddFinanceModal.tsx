import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AddFinanceModalProps {
  open: boolean;
  onClose: () => void;
  type?: "entrada" | "saida";
}

export function AddFinanceModal({ open, onClose, type = "entrada" }: AddFinanceModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(type);
  const [entradaData, setEntradaData] = useState({
    cliente: "",
    servico: "",
    valor: "",
    formaPagamento: "",
    data: new Date().toISOString().split('T')[0]
  });
  
  const [saidaData, setSaidaData] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: new Date().toISOString().split('T')[0]
  });

  const formasPagamento = [
    "Dinheiro",
    "Cartão de Débito",
    "Cartão de Crédito",
    "PIX",
    "Transferência"
  ];

  const tiposDespesa = [
    "Produto",
    "Material",
    "Aluguel",
    "Energia",
    "Internet",
    "Marketing",
    "Salário",
    "Outros"
  ];

  const handleSubmitEntrada = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entrada adicionada:", entradaData);
    
    toast({
      title: "Entrada registrada!",
      description: `Entrada de R$ ${entradaData.valor} foi registrada.`,
    });
    
    setEntradaData({
      cliente: "",
      servico: "",
      valor: "",
      formaPagamento: "",
      data: new Date().toISOString().split('T')[0]
    });
    
    onClose();
  };

  const handleSubmitSaida = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saída adicionada:", saidaData);
    
    toast({
      title: "Saída registrada!",
      description: `Saída de R$ ${saidaData.valor} foi registrada.`,
    });
    
    setSaidaData({
      tipo: "",
      descricao: "",
      valor: "",
      data: new Date().toISOString().split('T')[0]
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Movimento Financeiro</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "entrada" | "saida")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entrada">Entrada</TabsTrigger>
            <TabsTrigger value="saida">Saída</TabsTrigger>
          </TabsList>

          <TabsContent value="entrada">
            <form onSubmit={handleSubmitEntrada} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={entradaData.cliente}
                  onChange={(e) => setEntradaData({...entradaData, cliente: e.target.value})}
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servico">Serviço Executado *</Label>
                <Input
                  id="servico"
                  value={entradaData.servico}
                  onChange={(e) => setEntradaData({...entradaData, servico: e.target.value})}
                  placeholder="Nome do serviço"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Recebido (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={entradaData.valor}
                    onChange={(e) => setEntradaData({...entradaData, valor: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                  <Select value={entradaData.formaPagamento} onValueChange={(value) => setEntradaData({...entradaData, formaPagamento: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {formasPagamento.map((forma) => (
                        <SelectItem key={forma} value={forma}>{forma}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataEntrada">Data *</Label>
                <Input
                  id="dataEntrada"
                  type="date"
                  value={entradaData.data}
                  onChange={(e) => setEntradaData({...entradaData, data: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Entrada
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="saida">
            <form onSubmit={handleSubmitSaida} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Despesa *</Label>
                <Select value={saidaData.tipo} onValueChange={(value) => setSaidaData({...saidaData, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDespesa.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={saidaData.descricao}
                  onChange={(e) => setSaidaData({...saidaData, descricao: e.target.value})}
                  placeholder="Descreva a despesa"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorSaida">Valor (R$) *</Label>
                  <Input
                    id="valorSaida"
                    type="number"
                    step="0.01"
                    value={saidaData.valor}
                    onChange={(e) => setSaidaData({...saidaData, valor: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataSaida">Data *</Label>
                  <Input
                    id="dataSaida"
                    type="date"
                    value={saidaData.data}
                    onChange={(e) => setSaidaData({...saidaData, data: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Saída
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}