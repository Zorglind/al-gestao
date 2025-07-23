import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2
} from "lucide-react";

const Financeiro = () => {
  const [novaEntrada, setNovaEntrada] = useState({
    cliente: "",
    servico: "",
    valor: "",
    formaPagamento: "",
    data: ""
  });

  const [novaSaida, setNovaSaida] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data: ""
  });

  // Dados mockados
  const entradas = [
    { id: 1, cliente: "Maria Silva", servico: "Hidratação", valor: 150.00, formaPagamento: "Pix", data: "2024-01-15" },
    { id: 2, cliente: "Ana Santos", servico: "Corte + Finalização", valor: 200.00, formaPagamento: "Cartão", data: "2024-01-14" },
    { id: 3, cliente: "Beatriz Costa", servico: "Cronograma Capilar", valor: 250.00, formaPagamento: "Dinheiro", data: "2024-01-13" },
  ];

  const saidas = [
    { id: 1, tipo: "Produto", descricao: "Máscara Hidratante", valor: 45.00, data: "2024-01-15" },
    { id: 2, tipo: "Aluguel", descricao: "Aluguel do Espaço", valor: 800.00, data: "2024-01-10" },
    { id: 3, tipo: "Marketing", descricao: "Impulsionamento Instagram", valor: 100.00, data: "2024-01-08" },
  ];

  const totalEntradas = entradas.reduce((acc, entrada) => acc + entrada.valor, 0);
  const totalSaidas = saidas.reduce((acc, saida) => acc + saida.valor, 0);
  const saldoMensal = totalEntradas - totalSaidas;

  const adicionarEntrada = () => {
    console.log("Adicionar entrada:", novaEntrada);
    // Aqui seria a lógica para adicionar a entrada
    setNovaEntrada({ cliente: "", servico: "", valor: "", formaPagamento: "", data: "" });
  };

  const adicionarSaida = () => {
    console.log("Adicionar saída:", novaSaida);
    // Aqui seria a lógica para adicionar a saída
    setNovaSaida({ tipo: "", descricao: "", valor: "", data: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Controle Financeiro</h1>
          <p className="text-muted-foreground">Gerencie suas entradas e saídas mensais</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Mensal</CardTitle>
            <DollarSign className={`h-4 w-4 ${saldoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {saldoMensal >= 0 ? 'Lucro' : 'Prejuízo'} atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Entradas e Saídas */}
      <Tabs defaultValue="entradas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="saidas">Saídas</TabsTrigger>
        </TabsList>

        {/* Tab Entradas */}
        <TabsContent value="entradas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova Entrada</CardTitle>
              <CardDescription>
                Entradas são geradas automaticamente quando um agendamento é finalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    placeholder="Nome do cliente"
                    value={novaEntrada.cliente}
                    onChange={(e) => setNovaEntrada({...novaEntrada, cliente: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servico">Serviço</Label>
                  <Input
                    id="servico"
                    placeholder="Serviço realizado"
                    value={novaEntrada.servico}
                    onChange={(e) => setNovaEntrada({...novaEntrada, servico: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder="0,00"
                    value={novaEntrada.valor}
                    onChange={(e) => setNovaEntrada({...novaEntrada, valor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Select 
                    value={novaEntrada.formaPagamento} 
                    onValueChange={(value) => setNovaEntrada({...novaEntrada, formaPagamento: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novaEntrada.data}
                    onChange={(e) => setNovaEntrada({...novaEntrada, data: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={adicionarEntrada} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Entrada
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Entradas */}
          <Card>
            <CardHeader>
              <CardTitle>Entradas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entradas.map((entrada) => (
                  <div 
                    key={entrada.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(entrada.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{entrada.cliente}</h4>
                        <p className="text-sm text-muted-foreground">{entrada.servico}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{entrada.formaPagamento}</Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          R$ {entrada.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Saídas */}
        <TabsContent value="saidas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nova Saída</CardTitle>
              <CardDescription>
                Registre gastos e despesas do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Gasto</Label>
                  <Select 
                    value={novaSaida.tipo} 
                    onValueChange={(value) => setNovaSaida({...novaSaida, tipo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produto">Produto</SelectItem>
                      <SelectItem value="aluguel">Aluguel</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="equipamento">Equipamento</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    placeholder="Descreva o gasto"
                    value={novaSaida.descricao}
                    onChange={(e) => setNovaSaida({...novaSaida, descricao: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorSaida">Valor</Label>
                  <Input
                    id="valorSaida"
                    type="number"
                    placeholder="0,00"
                    value={novaSaida.valor}
                    onChange={(e) => setNovaSaida({...novaSaida, valor: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataSaida">Data</Label>
                  <Input
                    id="dataSaida"
                    type="date"
                    value={novaSaida.data}
                    onChange={(e) => setNovaSaida({...novaSaida, data: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={adicionarSaida} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Saída
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Saídas */}
          <Card>
            <CardHeader>
              <CardTitle>Saídas do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saidas.map((saida) => (
                  <div 
                    key={saida.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(saida.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{saida.descricao}</h4>
                        <p className="text-sm text-muted-foreground">{saida.tipo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          R$ {saida.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;