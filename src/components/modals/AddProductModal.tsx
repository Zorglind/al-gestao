import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { productsService } from "@/services/productsService";
import { useFileValidation } from "@/hooks/useFileValidation";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
  const { toast } = useToast();
  const { validateFile } = useFileValidation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoria: "",
    fabricante: "",
    nome: "",
    codigoBarras: "",
    valorVenda: "",
    informacoesAdicionais: "",
    foto: ""
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const isValid = await validateFile(file, 'image');
      if (!isValid) {
        toast({
          title: "Erro no arquivo",
          description: "Formato de arquivo inválido ou muito grande",
          variant: "destructive"
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, foto: imageUrl }));
      
      toast({
        title: "Imagem carregada!",
        description: "Imagem do produto adicionada com sucesso.",
      });
    }
  }, [toast, validateFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFile(null);
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
    setIsLoading(true);

    try {
      let imageUrl = formData.foto;

      // Upload image if file was selected
      if (uploadedFile) {
        imageUrl = await productsService.uploadImage(uploadedFile);
      }

      await productsService.create({
        name: formData.nome,
        category: formData.categoria,
        brand: formData.fabricante || undefined,
        description: formData.informacoesAdicionais || undefined,
        barcode: formData.codigoBarras || undefined,
        price: parseFloat(formData.valorVenda),
        image_url: imageUrl || undefined,
        stock_quantity: 0
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
        foto: ""
      });
      setUploadedImage(null);
      setUploadedFile(null);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro ao criar produto",
        description: "Ocorreu um erro ao cadastrar o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Adicionar Produto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}