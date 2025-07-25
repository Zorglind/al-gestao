import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDropzone } from "react-dropzone";
import { Upload, Image } from "lucide-react";
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
      setPreviewUrl(product.foto);
      setUploadedFile(null);
    }
  }, [product]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData({...formData, foto: url});
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

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
            <Label>Foto do Produto</Label>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
                <TabsTrigger value="url">URL da Imagem</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive ? 'Solte a imagem aqui...' : 'Clique ou arraste uma imagem aqui'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos: JPG, PNG, WEBP (máx. 1 arquivo)
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="url">
                <Input
                  value={formData.foto}
                  onChange={(e) => {
                    setFormData({...formData, foto: e.target.value});
                    setPreviewUrl(e.target.value);
                    setUploadedFile(null);
                  }}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </TabsContent>
            </Tabs>
            
            {previewUrl && (
              <div className="mt-4 p-4 border rounded-lg">
                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4" />
                  Preview da Imagem
                </Label>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
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