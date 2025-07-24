import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddServiceModal({ open, onClose }: AddServiceModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    categoria: "",
    subcategoria: "",
    nome: "",
    descricao: "",
    preco: "",
    duracao: "",
    comissao: ""
  });

  const categorias = [
    "Capilar",
    "Estética",
    "Terapêutico",
    "Massagem",
    "Tratamento"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Serviço adicionado:", formData);
    
    toast({
      title: "Serviço adicionado!",
      description: `${formData.nome} foi cadastrado com sucesso.`,
    });
    
    setFormData({
      categoria: "",
      subcategoria: "",
      nome: "",
      descricao: "",
      preco: "",
      duracao: "",
      comissao: ""
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <Input
                id="subcategoria"
                value={formData.subcategoria}
                onChange={(e) => setFormData({...formData, subcategoria: e.target.value})}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Serviço *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({...formData, preco: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (min) *</Label>
              <Input
                id="duracao"
                type="number"
                value={formData.duracao}
                onChange={(e) => setFormData({...formData, duracao: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comissao">Comissão (%)</Label>
              <Input
                id="comissao"
                type="number"
                max="100"
                value={formData.comissao}
                onChange={(e) => setFormData({...formData, comissao: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Serviço
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}