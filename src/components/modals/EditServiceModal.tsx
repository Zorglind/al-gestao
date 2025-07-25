import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  is_active: boolean;
  description?: string;
  commission_percentage?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface EditServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
}

export function EditServiceModal({ open, onClose, service }: EditServiceModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    duracao: "",
    valor: "",
    comissao: ""
  });

  const categorias = [
    "Capilar",
    "Estética",
    "Terapêutico",
    "Massagem",
    "Tratamento"
  ];

  useEffect(() => {
    if (service) {
      setFormData({
        nome: service.name,
        categoria: service.category,
        descricao: service.description || "",
        duracao: service.duration.toString(),
        valor: service.price.toString(),
        comissao: (service.commission_percentage || 0).toString()
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Serviço editado:", formData);
    
    toast({
      title: "Serviço atualizado!",
      description: `${formData.nome} foi atualizado com sucesso.`,
    });
    
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="valor">Preço (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
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
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}