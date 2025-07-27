import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    categoria: "",
    fabricante: "",
    nome: "",
    codigoBarras: "",
    valorVenda: "",
    informacoesAdicionais: "",
    foto: "",
    estoque: ""
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFormData(prev => ({ ...prev, foto: imageUrl }));
      
      toast({
        title: "Imagem carregada!",
        description: "Imagem do produto adicionada com sucesso.",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = () => {
    setUploadedImage(null);
    setFormData(prev => ({ ...prev, foto: "" }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || !formData.valorVenda) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { productsService } = await import("@/services/productsService");
      
      await productsService.create({
        name: formData.nome,
        category: formData.categoria,
        brand: formData.fabricante,
        description: formData.informacoesAdicionais,
        price: parseFloat(formData.valorVenda),
        stock_quantity: parseInt(formData.estoque) || 0,
        barcode: formData.codigoBarras,
        image_url: formData.foto
      });

      toast({
        title: "Produto adicionado!",
        description: `${formData.nome} foi cadastrado com sucesso.`,
      });

      // Reset form
      setFormData({
        categoria: "",
        fabricante: "",
        nome: "",
        codigoBarras: "",
        valorVenda: "",
        informacoesAdicionais: "",
        foto: "",
        estoque: ""
      });
      setUploadedImage(null);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <Label htmlFor="fabricante">Fabricante</Label>
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
            <Label htmlFor="estoque">Estoque Inicial</Label>
            <Input
              id="estoque"
              type="number"
              value={formData.estoque}
              onChange={(e) => setFormData({...formData, estoque: e.target.value})}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem do Produto</Label>
            <div className="space-y-4">
              {/* Upload de arquivo */}
              {!uploadedImage && (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Solte a imagem aqui...'
                      : 'Arraste uma imagem ou clique para selecionar'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP até 5MB
                  </p>
                </div>
              )}

              {/* Imagem carregada */}
              {uploadedImage && (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Campo de URL alternativo */}
              <div className="space-y-2">
                <Label htmlFor="foto">Ou digite uma URL da imagem</Label>
                <Input
                  id="foto"
                  value={formData.foto}
                  onChange={(e) => setFormData({...formData, foto: e.target.value})}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}