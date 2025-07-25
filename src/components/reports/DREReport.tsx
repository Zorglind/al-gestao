import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  Loader2
} from "lucide-react";
import { financialService } from '@/services/financialService';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

interface DREData {
  period: string;
  totalRevenue: number;
  operatingExpenses: {
    products: number;
    rent: number;
    marketing: number;
    other: number;
    total: number;
  };
  grossProfit: number;
  netIncome: number;
  profitMargin: number;
}

interface DREReportProps {
  open: boolean;
  onClose: () => void;
}

export function DREReport({ open, onClose }: DREReportProps) {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [dreData, setDreData] = useState<DREData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const months = [
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' }
  ];

  const generateDREData = async () => {
    setLoading(true);
    try {
      let startDate: string;
      let endDate: string;

      if (period === 'monthly') {
        const year = parseInt(selectedYear);
        const month = parseInt(selectedMonth);
        startDate = new Date(year, month, 1).toISOString().split('T')[0];
        endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      } else if (period === 'quarterly') {
        const year = parseInt(selectedYear);
        const quarter = Math.floor(parseInt(selectedMonth) / 3) + 1;
        startDate = new Date(year, (quarter - 1) * 3, 1).toISOString().split('T')[0];
        endDate = new Date(year, quarter * 3, 0).toISOString().split('T')[0];
      } else {
        const year = parseInt(selectedYear);
        startDate = new Date(year, 0, 1).toISOString().split('T')[0];
        endDate = new Date(year, 11, 31).toISOString().split('T')[0];
      }

      const summary = await financialService.getSummary(startDate, endDate);
      const entries = await financialService.getByDateRange(startDate, endDate);

      // Categorize expenses
      const expenses = entries.filter(entry => entry.type === 'expense');
      const expensesByCategory = {
        products: expenses.filter(e => e.category.toLowerCase().includes('produto')).reduce((sum, e) => sum + Number(e.amount), 0),
        rent: expenses.filter(e => e.category.toLowerCase().includes('aluguel')).reduce((sum, e) => sum + Number(e.amount), 0),
        marketing: expenses.filter(e => e.category.toLowerCase().includes('marketing')).reduce((sum, e) => sum + Number(e.amount), 0),
        other: expenses.filter(e => !['produto', 'aluguel', 'marketing'].some(cat => e.category.toLowerCase().includes(cat))).reduce((sum, e) => sum + Number(e.amount), 0)
      };

      const totalExpenses = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);
      const grossProfit = summary.totalIncome - expensesByCategory.products;
      const netIncome = summary.totalIncome - totalExpenses;
      const profitMargin = summary.totalIncome > 0 ? (netIncome / summary.totalIncome) * 100 : 0;

      const periodLabel = period === 'monthly' 
        ? `${months[parseInt(selectedMonth)].label}/${selectedYear}`
        : period === 'quarterly'
        ? `Q${Math.floor(parseInt(selectedMonth) / 3) + 1}/${selectedYear}`
        : selectedYear;

      setDreData({
        period: periodLabel,
        totalRevenue: summary.totalIncome,
        operatingExpenses: {
          ...expensesByCategory,
          total: totalExpenses
        },
        grossProfit,
        netIncome,
        profitMargin
      });
    } catch (error) {
      console.error('Error generating DRE:', error);
      toast({
        title: "Erro ao gerar DRE",
        description: "Não foi possível gerar o demonstrativo de resultados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      generateDREData();
    }
  }, [open, period, selectedMonth, selectedYear]);

  const generatePDF = () => {
    if (!dreData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Demonstrativo de Resultados do Exercício (DRE)', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text(`Período: ${dreData.period}`, pageWidth / 2, 45, { align: 'center' });
    
    let yPos = 70;
    
    // Revenue
    pdf.setFontSize(16);
    pdf.text('RECEITAS', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(12);
    pdf.text('Receita Bruta de Serviços', 30, yPos);
    pdf.text(`R$ ${dreData.totalRevenue.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 20;
    
    // Expenses
    pdf.setFontSize(16);
    pdf.text('CUSTOS E DESPESAS OPERACIONAIS', 20, yPos);
    yPos += 15;
    
    pdf.setFontSize(12);
    pdf.text('Custos com Produtos', 30, yPos);
    pdf.text(`R$ ${dreData.operatingExpenses.products.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 10;
    
    pdf.text('Aluguel', 30, yPos);
    pdf.text(`R$ ${dreData.operatingExpenses.rent.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 10;
    
    pdf.text('Marketing', 30, yPos);
    pdf.text(`R$ ${dreData.operatingExpenses.marketing.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 10;
    
    pdf.text('Outras Despesas', 30, yPos);
    pdf.text(`R$ ${dreData.operatingExpenses.other.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 10;
    
    // Line
    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 5;
    
    pdf.text('Total de Custos e Despesas', 30, yPos);
    pdf.text(`R$ ${dreData.operatingExpenses.total.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 20;
    
    // Results
    pdf.setFontSize(14);
    pdf.text('Lucro Bruto', 20, yPos);
    pdf.text(`R$ ${dreData.grossProfit.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 15;
    
    pdf.text('Resultado Líquido do Período', 20, yPos);
    pdf.text(`R$ ${dreData.netIncome.toFixed(2)}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 15;
    
    pdf.text(`Margem de Lucro: ${dreData.profitMargin.toFixed(2)}%`, 20, yPos);
    
    // Footer
    const today = new Date().toLocaleDateString('pt-BR');
    pdf.setFontSize(10);
    pdf.text(`Relatório gerado em ${today}`, pageWidth / 2, pdf.internal.pageSize.height - 20, { align: 'center' });
    
    pdf.save(`DRE_${dreData.period.replace('/', '_')}.pdf`);
    
    toast({
      title: "PDF gerado com sucesso!",
      description: "O relatório DRE foi baixado.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Demonstrativo de Resultados do Exercício (DRE)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Período de Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={period} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setPeriod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {period === 'monthly' && (
                  <div>
                    <label className="text-sm font-medium">Mês</label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Ano</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DRE Report */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Gerando DRE...</p>
              </div>
            </div>
          ) : dreData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>DRE - {dreData.period}</span>
                  <Button onClick={generatePDF} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Revenue */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">RECEITAS</h3>
                  <div className="flex justify-between py-2">
                    <span>Receita Bruta de Serviços</span>
                    <span className="font-medium text-green-600">{formatCurrency(dreData.totalRevenue)}</span>
                  </div>
                </div>

                <Separator />

                {/* Expenses */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">CUSTOS E DESPESAS OPERACIONAIS</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="ml-4">Custos com Produtos</span>
                      <span className="text-red-600">({formatCurrency(dreData.operatingExpenses.products)})</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="ml-4">Aluguel</span>
                      <span className="text-red-600">({formatCurrency(dreData.operatingExpenses.rent)})</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="ml-4">Marketing</span>
                      <span className="text-red-600">({formatCurrency(dreData.operatingExpenses.marketing)})</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="ml-4">Outras Despesas</span>
                      <span className="text-red-600">({formatCurrency(dreData.operatingExpenses.other)})</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between py-2 font-medium">
                      <span>Total de Custos e Despesas</span>
                      <span className="text-red-600">({formatCurrency(dreData.operatingExpenses.total)})</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="space-y-4">
                  <div className="flex justify-between py-2 text-lg">
                    <span className="font-semibold">Lucro Bruto</span>
                    <span className={`font-bold ${dreData.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(dreData.grossProfit)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 text-lg border-t-2 border-gray-200">
                    <span className="font-semibold">Resultado Líquido do Período</span>
                    <span className={`font-bold ${dreData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(dreData.netIncome)}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="font-medium">Margem de Lucro</span>
                    <div className="flex items-center gap-2">
                      {dreData.profitMargin >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-bold ${dreData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {dreData.profitMargin.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}