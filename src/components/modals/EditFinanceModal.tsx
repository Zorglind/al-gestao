import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface FinanceEntry {
  id: number;
  tipo: "entrada" | "saida";
  cliente?: string;
  servico?: string;
  categoria?: string;
  descricao?: string;
  valor: number;
  formaPagamento?: string;
  data: string;
}

interface EditFinanceModalProps {
  open: boolean;
  onClose: () => void;
  entry: FinanceEntry | null;
  onSave: (updatedEntry: FinanceEntry) => void;
}

export function EditFinanceModal({ open, onClose, entry, onSave }: EditFinanceModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FinanceEntry>({
    id: 0,
    tipo: "entrada",
    valor: 0,
    data: ""
  });

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave(formData);
    
    toast({
      title: "Lançamento atualizado!",
      description: `${formData.tipo === "entrada" ? "Entrada" : "Saída"} de R$ ${formData.valor.toFixed(2)} foi atualizada.`,
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar {formData.tipo === "entrada" ? "Entrada" : "Saída"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.tipo === "entrada" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  value={formData.cliente || ""}
                  onChange={(e) => handleInputChange("cliente", e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servico">Serviço</Label>
                <Input
                  id="servico"
                  value={formData.servico || ""}
                  onChange={(e) => handleInputChange("servico", e.target.value)}
                  placeholder="Tipo de serviço"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                <Select 
                  value={formData.formaPagamento || ""} 
                  onValueChange={(value) => handleInputChange("formaPagamento", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao-debito">Cartão de Débito</SelectItem>
                    <SelectItem value="cartao-credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select 
                  value={formData.categoria || ""} 
                  onValueChange={(value) => handleInputChange("categoria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produtos">Produtos</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                    <SelectItem value="energia">Energia</SelectItem>
                    <SelectItem value="agua">Água</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao || ""}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descrição da despesa"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => handleInputChange("valor", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange("data", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}