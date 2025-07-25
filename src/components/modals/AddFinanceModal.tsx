import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { financialService, CreateFinancialEntryData, FINANCIAL_CATEGORIES, CATEGORY_LABELS, SUBCATEGORY_LABELS, PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/services/financialService";

interface AddFinanceModalProps {
  open: boolean;
  onClose: () => void;
  type?: "entrada" | "saida";
  onSuccess?: () => void;
}

export const AddFinanceModal: React.FC<AddFinanceModalProps> = ({
  open,
  onClose,
  type = "entrada",
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState(type);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data for income (entrada)
  const [incomeData, setIncomeData] = useState<Partial<CreateFinancialEntryData>>({
    type: 'income',
    description: '',
    amount: 0,
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    payment_method: 'dinheiro',
    observations: ''
  });

  // Form data for expense (saida)
  const [expenseData, setExpenseData] = useState<Partial<CreateFinancialEntryData>>({
    type: 'expense',
    description: '',
    amount: 0,
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    payment_method: 'dinheiro',
    observations: ''
  });

  const resetForms = () => {
    setIncomeData({
      type: 'income',
      description: '',
      amount: 0,
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      payment_method: 'dinheiro',
      observations: ''
    });
    setExpenseData({
      type: 'expense',
      description: '',
      amount: 0,
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      payment_method: 'dinheiro',
      observations: ''
    });
  };

  const handleSubmitIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeData.category || !incomeData.subcategory || !incomeData.amount || !incomeData.observations?.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await financialService.create(incomeData as CreateFinancialEntryData);
      toast.success("Entrada financeira registrada com sucesso!");
      resetForms();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating income entry:', error);
      toast.error("Erro ao registrar entrada financeira");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseData.category || !expenseData.subcategory || !expenseData.amount || !expenseData.observations?.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await financialService.create(expenseData as CreateFinancialEntryData);
      toast.success("Saída financeira registrada com sucesso!");
      resetForms();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating expense entry:', error);
      toast.error("Erro ao registrar saída financeira");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category: string, isIncome: boolean) => {
    if (isIncome) {
      setIncomeData(prev => ({ 
        ...prev, 
        category, 
        subcategory: FINANCIAL_CATEGORIES.income[category as keyof typeof FINANCIAL_CATEGORIES.income]?.[0] || ''
      }));
    } else {
      setExpenseData(prev => ({ 
        ...prev, 
        category, 
        subcategory: ''
      }));
    }
  };

  const getSubcategoryOptions = (category: string, isIncome: boolean) => {
    if (isIncome) {
      return FINANCIAL_CATEGORIES.income[category as keyof typeof FINANCIAL_CATEGORIES.income] || [];
    } else {
      const subcategories = FINANCIAL_CATEGORIES.expense[category as keyof typeof FINANCIAL_CATEGORIES.expense];
      return subcategories || [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Lançamento Financeiro</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "entrada" | "saida")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entrada" className="text-green-600">Entrada</TabsTrigger>
            <TabsTrigger value="saida" className="text-red-600">Saída</TabsTrigger>
          </TabsList>

          <TabsContent value="entrada">
            <form onSubmit={handleSubmitIncome} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-category">Categoria *</Label>
                  <Select 
                    value={incomeData.category} 
                    onValueChange={(value) => handleCategoryChange(value, true)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(FINANCIAL_CATEGORIES.income).map((category) => (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-subcategory">Subcategoria *</Label>
                  <Select 
                    value={incomeData.subcategory} 
                    onValueChange={(value) => setIncomeData(prev => ({ ...prev, subcategory: value }))}
                    required
                    disabled={!incomeData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoryOptions(incomeData.category || '', true).map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {SUBCATEGORY_LABELS[subcategory] || subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-description">Descrição *</Label>
                <Input
                  id="income-description"
                  value={incomeData.description}
                  onChange={(e) => setIncomeData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Venda de produto, serviço prestado..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Valor (R$) *</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={incomeData.amount}
                    onChange={(e) => setIncomeData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-payment">Forma de Pagamento *</Label>
                  <Select 
                    value={incomeData.payment_method} 
                    onValueChange={(value) => setIncomeData(prev => ({ ...prev, payment_method: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {PAYMENT_METHOD_LABELS[method]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-date">Data *</Label>
                  <Input
                    id="income-date"
                    type="date"
                    value={incomeData.date}
                    onChange={(e) => setIncomeData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-time">Hora *</Label>
                  <Input
                    id="income-time"
                    type="time"
                    value={incomeData.time}
                    onChange={(e) => setIncomeData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-observations">Observações *</Label>
                <Textarea
                  id="income-observations"
                  value={incomeData.observations}
                  onChange={(e) => setIncomeData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Detalhes sobre esta entrada..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  {isSubmitting ? "Salvando..." : "Registrar Entrada"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="saida">
            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-category">Categoria *</Label>
                  <Select 
                    value={expenseData.category} 
                    onValueChange={(value) => handleCategoryChange(value, false)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(FINANCIAL_CATEGORIES.expense).map((category) => (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-subcategory">Subcategoria *</Label>
                  {expenseData.category && (expenseData.category === 'outras_despesas' || expenseData.category === 'reserva_financeira') ? (
                    <Input
                      value={expenseData.subcategory}
                      onChange={(e) => setExpenseData(prev => ({ ...prev, subcategory: e.target.value }))}
                      placeholder="Digite a subcategoria"
                      required
                    />
                  ) : (
                    <Select 
                      value={expenseData.subcategory} 
                      onValueChange={(value) => setExpenseData(prev => ({ ...prev, subcategory: value }))}
                      required
                      disabled={!expenseData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a subcategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubcategoryOptions(expenseData.category || '', false).map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {SUBCATEGORY_LABELS[subcategory] || subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-description">Descrição *</Label>
                <Input
                  id="expense-description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Pagamento de fornecedor, compra de material..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-amount">Valor (R$) *</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-payment">Forma de Pagamento *</Label>
                  <Select 
                    value={expenseData.payment_method} 
                    onValueChange={(value) => setExpenseData(prev => ({ ...prev, payment_method: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {PAYMENT_METHOD_LABELS[method]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Data *</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseData.date}
                    onChange={(e) => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-time">Hora *</Label>
                  <Input
                    id="expense-time"
                    type="time"
                    value={expenseData.time}
                    onChange={(e) => setExpenseData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-observations">Observações *</Label>
                <Textarea
                  id="expense-observations"
                  value={expenseData.observations}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Detalhes sobre esta despesa..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
                  {isSubmitting ? "Salvando..." : "Registrar Saída"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};