import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { servicesService } from '@/services/servicesService';
import { Upload, Loader2 } from "lucide-react";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddServiceModal({ open, onClose, onSuccess }: AddServiceModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const serviceData = {
        name: formData.nome,
        category: formData.categoria,
        description: formData.descricao,
        price: parseFloat(formData.preco),
        duration: parseInt(formData.duracao),
        commission_percentage: formData.comissao ? parseFloat(formData.comissao) : 0
      };

      await servicesService.create(serviceData);
      
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
      setImageFile(null);
      setImagePreview(null);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Erro ao criar serviço",
        description: "Não foi possível criar o serviço. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Serviço</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
              {imagePreview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
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
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Adicionar Serviço'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}