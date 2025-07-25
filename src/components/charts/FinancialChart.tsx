import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialData {
  date: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

interface FinancialChartProps {
  entradas: Array<{ data: string; valor: number }>;
  saidas: Array<{ data: string; valor: number }>;
}

export function FinancialChart({ entradas, saidas }: FinancialChartProps) {
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('mes');

  // Agrupa os dados por período
  const generateChartData = (): FinancialData[] => {
    const dataMap = new Map<string, { entradas: number; saidas: number }>();

    // Processa entradas
    entradas.forEach(entrada => {
      const date = new Date(entrada.data);
      let key: string;

      switch (period) {
        case 'dia':
          key = date.toISOString().split('T')[0];
          break;
        case 'semana':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'mes':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, { entradas: 0, saidas: 0 });
      }
      dataMap.get(key)!.entradas += entrada.valor;
    });

    // Processa saídas
    saidas.forEach(saida => {
      const date = new Date(saida.data);
      let key: string;

      switch (period) {
        case 'dia':
          key = date.toISOString().split('T')[0];
          break;
        case 'semana':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'mes':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, { entradas: 0, saidas: 0 });
      }
      dataMap.get(key)!.saidas += saida.valor;
    });

    // Converte para array e calcula saldo
    return Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        entradas: data.entradas,
        saidas: data.saidas,
        saldo: data.entradas - data.saidas
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const chartData = generateChartData();
  const totalEntradas = chartData.reduce((acc, item) => acc + item.entradas, 0);
  const totalSaidas = chartData.reduce((acc, item) => acc + item.saidas, 0);
  const saldoTotal = totalEntradas - totalSaidas;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatXAxisLabel = (tickItem: string) => {
    switch (period) {
      case 'dia':
        return new Date(tickItem).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      case 'semana':
        return `Sem ${new Date(tickItem).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
      case 'mes':
        const [year, month] = tickItem.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      default:
        return tickItem;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Gráfico Financeiro
            </CardTitle>
            <CardDescription>
              Visualização comparativa de entradas e saídas
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-lg font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldoTotal)}
              </div>
              <div className="text-sm text-muted-foreground">
                Saldo {period === 'mes' ? 'Mensal' : period === 'semana' ? 'Semanal' : 'Diário'}
              </div>
            </div>
            <Select value={period} onValueChange={(value: 'dia' | 'semana' | 'mes') => setPeriod(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Por Dia</SelectItem>
                <SelectItem value="semana">Por Semana</SelectItem>
                <SelectItem value="mes">Por Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                className="text-xs"
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'entradas' ? 'Entradas' : name === 'saidas' ? 'Saídas' : 'Saldo'
                ]}
                labelFormatter={(label) => `Período: ${formatXAxisLabel(label)}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="entradas" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                name="Entradas"
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="saidas" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={3}
                name="Saídas"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Total Entradas:</span>
            <span className="font-semibold text-green-600">{formatCurrency(totalEntradas)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm text-muted-foreground">Total Saídas:</span>
            <span className="font-semibold text-red-600">{formatCurrency(totalSaidas)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}