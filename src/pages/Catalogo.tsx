import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Search, Tag, Share2, Package, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const { toast } = useToast();

  // Mock data - Em um app real, isso viria de uma API ou contexto global
  const produtos = [
    {
      id: 1,
      nome: "Shampoo Hidratante Natural",
      categoria: "Shampoo",
      tipo: "produto",
      descricao: "Shampoo com ingredientes naturais para hidratação profunda",
      foto: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop",
      ativo: true
    },
    {
      id: 2,
      nome: "Condicionador Nutritivo",
      categoria: "Condicionador",
      tipo: "produto",
      descricao: "Condicionador rico em nutrientes para cabelos cacheados",
      foto: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop",
      ativo: true
    },
    {
      id: 3,
      nome: "Máscara Reparadora",
      categoria: "Tratamento",
      tipo: "produto",
      descricao: "Máscara intensiva para reparação de cabelos danificados",
      foto: "https://images.unsplash.com/photo-1599351431613-67b97376e40d?w=300&h=300&fit=crop",
      ativo: true
    }
  ];

  const servicos = [
    {
      id: 4,
      nome: "Hidratação Intensiva",
      categoria: "Tratamento",
      tipo: "servico",
      descricao: "Tratamento profundo para cabelos ressecados e danificados",
      foto: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=300&h=300&fit=crop",
      ativo: true
    },
    {
      id: 5,
      nome: "Corte Especializado",
      categoria: "Corte",
      tipo: "servico",
      descricao: "Corte personalizado respeitando o formato do rosto e textura capilar",
      foto: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop",
      ativo: true
    },
    {
      id: 6,
      nome: "Cronograma Capilar",
      categoria: "Tratamento",
      tipo: "servico",
      descricao: "Protocolo completo de hidratação, nutrição e reconstrução",
      foto: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300&h=300&fit=crop",
      ativo: true
    }
  ];

  // Combinar produtos e serviços ativos
  const todosItens = [...produtos, ...servicos].filter(item => item.ativo);

  const filteredItens = todosItens.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "todos" || 
                           categoryFilter === item.tipo ||
                           categoryFilter === item.categoria;
    
    return matchesSearch && matchesCategory;
  });

  const handleShare = (item: any) => {
    const message = `Veja esse ${item.tipo === 'produto' ? 'produto' : 'serviço'} que recomendo pra você!

📝 *${item.nome}*
${item.descricao}

${item.foto ? `🖼️ Veja a imagem: ${item.foto}` : ''}

Entre em contato para mais informações! 🌟`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Compartilhado!",
      description: `${item.nome} foi compartilhado via WhatsApp.`,
    });
  };

  const getCategoriaColor = (categoria: string, tipo: string) => {
    if (tipo === 'produto') {
      const cores = {
        "Shampoo": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
        "Condicionador": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
        "Tratamento": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
        "Finalizador": "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
      };
      return cores[categoria as keyof typeof cores] || "bg-gray-100 text-gray-800";
    } else {
      const cores = {
        "Corte": "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
        "Tratamento": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
        "Coloração": "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
        "Relaxamento": "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
      };
      return cores[categoria as keyof typeof cores] || "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'produto' ? Package : Scissors;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Catálogo</h1>
          <p className="text-muted-foreground">Produtos e serviços Sol Lima</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar no Catálogo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os itens</SelectItem>
                <SelectItem value="produto">Apenas Produtos</SelectItem>
                <SelectItem value="servico">Apenas Serviços</SelectItem>
                <SelectItem value="Shampoo">Shampoo</SelectItem>
                <SelectItem value="Condicionador">Condicionador</SelectItem>
                <SelectItem value="Tratamento">Tratamento</SelectItem>
                <SelectItem value="Corte">Corte</SelectItem>
                <SelectItem value="Coloração">Coloração</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{todosItens.length}</div>
            <p className="text-sm text-muted-foreground">Total de Itens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{produtos.filter(p => p.ativo).length}</div>
            <p className="text-sm text-muted-foreground">Produtos Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{servicos.filter(s => s.ativo).length}</div>
            <p className="text-sm text-muted-foreground">Serviços Ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Catálogo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItens.map((item) => {
          const IconComponent = getTipoIcon(item.tipo);
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                <img 
                  src={item.foto} 
                  alt={item.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <IconComponent className="h-3 w-3" />
                    {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{item.nome}</h3>
                    <p className="text-sm text-muted-foreground">{item.descricao}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoriaColor(item.categoria, item.tipo)}>
                      <Tag className="h-3 w-3 mr-1" />
                      {item.categoria}
                    </Badge>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="w-full flex items-center gap-2" 
                    onClick={() => handleShare(item)}
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItens.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum item encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Catalogo;