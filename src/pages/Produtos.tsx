import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Plus, Search, Tag, Package2, Trash2, Loader2 } from "lucide-react";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { EditProductModal } from "@/components/modals/EditProductModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { productsService, type Product } from "@/services/productsService";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar produtos do banco de dados
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getAll();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productsService.delete(productId);
      await loadProducts(); // Recarregar lista
      toast({
        title: "Produto excluído",
        description: "O produto foi removido do catálogo.",
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  const handleProductAdded = () => {
    loadProducts(); // Recarregar lista quando produto for adicionado
    setShowAddProductModal(false);
  };

  const handleProductUpdated = () => {
    loadProducts(); // Recarregar lista quando produto for editado
    setShowEditProductModal(false);
    setSelectedProduct(null);
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoriaColor = (categoria: string) => {
    const cores = {
      "Shampoo": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      "Condicionador": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      "Tratamento": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      "Finalizador": "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
    };
    return cores[categoria as keyof typeof cores] || "bg-gray-100 text-gray-800";
  };

  const getEstoqueStatus = (estoque: number) => {
    if (estoque <= 5) return "Baixo";
    if (estoque <= 15) return "Médio";
    return "Bom";
  };

  const getEstoqueColor = (estoque: number) => {
    if (estoque <= 5) return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    if (estoque <= 15) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
  };

  const totalProdutos = produtos.length;
  const produtosBaixoEstoque = produtos.filter(p => (p.stock_quantity || 0) <= 5).length;
  const estoqueTotal = produtos.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Produtos</h1>
            <p className="text-muted-foreground">Catálogo de produtos Sol Lima</p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Produtos</h1>
          <p className="text-muted-foreground">Catálogo de produtos Sol Lima</p>
        </div>
        <Button variant="default" className="flex items-center gap-2" onClick={() => setShowAddProductModal(true)}>
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Produtos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{totalProdutos}</div>
            <p className="text-sm text-muted-foreground">Total de Produtos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{produtosBaixoEstoque}</div>
            <p className="text-sm text-muted-foreground">Baixo Estoque</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{estoqueTotal}</div>
            <p className="text-sm text-muted-foreground">Itens em Estoque</p>
          </CardContent>
        </Card>
      </div>

      {/* Catálogo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProdutos.map((produto) => (
          <Card key={produto.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img 
                src={produto.image_url || '/placeholder.svg'} 
                alt={produto.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge className={getEstoqueColor(produto.stock_quantity || 0)}>
                  {getEstoqueStatus(produto.stock_quantity || 0)}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{produto.name}</h3>
                  <p className="text-sm text-muted-foreground">{produto.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={getCategoriaColor(produto.category)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {produto.category}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{produto.stock_quantity || 0}</span>
                    <span className="text-muted-foreground">unidades</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setSelectedProduct(produto);
                    setShowEditProductModal(true);
                  }}>
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{produto.name}"? Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(produto.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </CardContent>
        </Card>
      )}

      <AddProductModal 
        open={showAddProductModal} 
        onClose={() => setShowAddProductModal(false)}
        onSuccess={handleProductAdded}
      />
      
      <EditProductModal 
        open={showEditProductModal} 
        onClose={() => {
          setShowEditProductModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={handleProductUpdated}
      />
    </div>
  );
};

export default Produtos;
