import { useState, useEffect } from "react";
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
  Trash2,
  Loader2
} from "lucide-react";
import { AddFinanceModal } from "@/components/modals/AddFinanceModal";
import { EditFinanceModal, type FinanceEntry } from "@/components/modals/EditFinanceModal";
import { FinancialChart } from "@/components/charts/FinancialChart";
import { useToast } from "@/hooks/use-toast";
import { financialService, type FinancialEntry, PAYMENT_METHOD_LABELS, CATEGORY_LABELS } from "@/services/financialService";

const Financeiro = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [modalType, setModalType] = useState<"entrada" | "saida">("entrada");
  const [isLoading, setIsLoading] = useState(true);
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
  
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    incomeCount: 0,
    expenseCount: 0
  });

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);
      const [entries, summaryData] = await Promise.all([
        financialService.getAll(),
        financialService.getSummary()
      ]);
      setFinancialEntries(entries);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados financeiros.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const incomeEntries = financialEntries.filter(entry => entry.type === 'income');
  const expenseEntries = financialEntries.filter(entry => entry.type === 'expense');

  const handleEditEntry = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleSaveEntry = async (updatedEntry: FinancialEntry) => {
    try {
      await financialService.update(updatedEntry.id, {
        description: updatedEntry.description,
        amount: updatedEntry.amount,
        category: updatedEntry.category,
        subcategory: updatedEntry.subcategory,
        payment_method: updatedEntry.payment_method,
        date: updatedEntry.date,
        time: updatedEntry.time,
        observations: updatedEntry.observations
      });
      
      toast({
        title: "Lançamento atualizado!",
        description: "Os dados foram salvos com sucesso.",
      });
      
      loadFinancialData(); // Reload data
    } catch (error) {
      console.error('Error updating entry:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEntry = async (entry: FinancialEntry) => {
    try {
      await financialService.delete(entry.id);
      
      toast({
        title: "Lançamento excluído!",
        description: `${entry.type === "income" ? "Entrada" : "Saída"} foi removida com sucesso.`,
      });
      
      loadFinancialData(); // Reload data
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o lançamento.",
        variant: "destructive"
      });
    }
  };

  const handleFinanceModalSuccess = () => {
    loadFinancialData(); // Reload data after adding new entry
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Controle Financeiro</h1>
          <p className="text-muted-foreground">Gerencie suas entradas e saídas mensais</p>
        </div>
      </div>

      {/* Gráfico Financeiro */}
      <FinancialChart 
        entradas={incomeEntries.map(e => ({ data: e.date, valor: Number(e.amount) }))}
        saidas={expenseEntries.map(s => ({ data: s.date, valor: Number(s.amount) }))}
      />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              R$ {summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Mensal</CardTitle>
            <DollarSign className={`h-4 w-4 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.balance >= 0 ? 'Lucro' : 'Prejuízo'} atual
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
              <Button onClick={() => {
                setModalType("entrada");
                setShowFinanceModal(true);
              }} className="mt-4">
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
                {incomeEntries.map((entrada) => (
                  <div 
                    key={entrada.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(entrada.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{entrada.description}</h4>
                        <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[entrada.category] || entrada.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{PAYMENT_METHOD_LABELS[entrada.payment_method] || entrada.payment_method}</Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          R$ {Number(entrada.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditEntry(entrada)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEntry(entrada)}
                        >
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
              <Button onClick={() => {
                setModalType("saida");
                setShowFinanceModal(true);
              }} className="mt-4">
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
                {expenseEntries.map((saida) => (
                  <div 
                    key={saida.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(saida.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{saida.description}</h4>
                        <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[saida.category] || saida.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          R$ {Number(saida.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditEntry(saida)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEntry(saida)}
                        >
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
      
      <AddFinanceModal 
        open={showFinanceModal} 
        onClose={() => setShowFinanceModal(false)}
        type={modalType}
        onSuccess={handleFinanceModalSuccess}
      />
      
      <EditFinanceModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        entry={editingEntry as any}
        onSave={handleSaveEntry as any}
      />
    </div>
  );
};

export default Financeiro;