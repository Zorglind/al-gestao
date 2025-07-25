import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Plus, Search, Tag, Package2, Trash2 } from "lucide-react";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { EditProductModal } from "@/components/modals/EditProductModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Shampoo Hidratante Natural",
      categoria: "Shampoo",
      estoque: 25,
      descricao: "Shampoo com ingredientes naturais para hidratação profunda",
      foto: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      nome: "Condicionador Nutritivo",
      categoria: "Condicionador",
      estoque: 18,
      descricao: "Condicionador rico em nutrientes para cabelos cacheados",
      foto: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      nome: "Máscara Reparadora",
      categoria: "Tratamento",
      estoque: 12,
      descricao: "Máscara intensiva para reparação de cabelos danificados",
      foto: "https://images.unsplash.com/photo-1599351431613-67b97376e40d?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      nome: "Óleo Capilar Multifuncional",
      categoria: "Finalizador",
      estoque: 8,
      descricao: "Óleo vegetal para nutrição e brilho",
      foto: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      nome: "Leave-in Protetor",
      categoria: "Finalizador",
      estoque: 30,
      descricao: "Leave-in com proteção térmica e anti-frizz",
      foto: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop"
    },
  ]);
  const { toast } = useToast();

  const handleDeleteProduct = (productId: number) => {
    setProdutos(produtos.filter(produto => produto.id !== productId));
    toast({
      title: "Produto excluído",
      description: "O produto foi removido do catálogo.",
    });
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
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
  const produtosBaixoEstoque = produtos.filter(p => p.estoque <= 5).length;
  const estoqueTotal = produtos.reduce((acc, p) => acc + p.estoque, 0);

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
                src={produto.foto} 
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getEstoqueColor(produto.estoque)}>
                  {getEstoqueStatus(produto.estoque)}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{produto.nome}</h3>
                  <p className="text-sm text-muted-foreground">{produto.descricao}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={getCategoriaColor(produto.categoria)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {produto.categoria}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{produto.estoque}</span>
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
                          Tem certeza que deseja excluir "{produto.nome}"? Esta ação não poderá ser desfeita.
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
      />
      
      <EditProductModal 
        open={showEditProductModal} 
        onClose={() => setShowEditProductModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Produtos;