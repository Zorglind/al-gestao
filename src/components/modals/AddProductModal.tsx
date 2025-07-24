import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    categoria: "",
    fabricante: "",
    nome: "",
    codigoBarras: "",
    valorVenda: "",
    informacoesAdicionais: ""
  });

  const categorias = [
    "Shampoo",
    "Condicionador",
    "Máscara",
    "Ampola",
    "Óleo",
    "Creme",
    "Suplemento"
  ];

  const fabricantes = [
    "L'Oréal",
    "Kerastase",
    "Wella",
    "Matrix",
    "Redken",
    "Paul Mitchell"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produto adicionado:", formData);
    
    toast({
      title: "Produto adicionado!",
      description: `${formData.nome} foi cadastrado com sucesso.`,
    });
    
    setFormData({
      categoria: "",
      fabricante: "",
      nome: "",
      codigoBarras: "",
      valorVenda: "",
      informacoesAdicionais: ""
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                  <SelectItem value="nova">+ Adicionar nova categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante *</Label>
              <Select value={formData.fabricante} onValueChange={(value) => setFormData({...formData, fabricante: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fabricante" />
                </SelectTrigger>
                <SelectContent>
                  {fabricantes.map((fabricante) => (
                    <SelectItem key={fabricante} value={fabricante}>{fabricante}</SelectItem>
                  ))}
                  <SelectItem value="novo">+ Adicionar fabricante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoBarras">Código de Barras</Label>
              <Input
                id="codigoBarras"
                value={formData.codigoBarras}
                onChange={(e) => setFormData({...formData, codigoBarras: e.target.value})}
                placeholder="7891234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorVenda">Valor de Venda (R$) *</Label>
              <Input
                id="valorVenda"
                type="number"
                step="0.01"
                value={formData.valorVenda}
                onChange={(e) => setFormData({...formData, valorVenda: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="informacoesAdicionais">Informações Adicionais</Label>
            <Textarea
              id="informacoesAdicionais"
              value={formData.informacoesAdicionais}
              onChange={(e) => setFormData({...formData, informacoesAdicionais: e.target.value})}
              rows={3}
              placeholder="Descrição, ingredientes, modo de uso..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}