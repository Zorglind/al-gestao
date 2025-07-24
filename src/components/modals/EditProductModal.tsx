import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  descricao: string;
  foto: string;
}

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function EditProductModal({ open, onClose, product }: EditProductModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    estoque: "",
    foto: ""
  });

  const categorias = [
    "Shampoo",
    "Condicionador", 
    "Tratamento",
    "Finalizador",
    "Acessórios"
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        categoria: product.categoria,
        descricao: product.descricao,
        estoque: product.estoque.toString(),
        foto: product.foto
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produto editado:", formData);
    
    toast({
      title: "Produto atualizado!",
      description: `${formData.nome} foi atualizado com sucesso.`,
    });
    
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

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
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estoque">Estoque</Label>
            <Input
              id="estoque"
              type="number"
              value={formData.estoque}
              onChange={(e) => setFormData({...formData, estoque: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto">URL da Foto</Label>
            <Input
              id="foto"
              value={formData.foto}
              onChange={(e) => setFormData({...formData, foto: e.target.value})}
              placeholder="https://..."
            />
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