import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus, Download, User, Calendar } from "lucide-react";

const Anamnese = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const fichas = [
    {
      id: 1,
      cliente: "Maria Silva",
      profissional: "Ana Silva",
      servico: "Hidratação Intensiva",
      data: "2024-01-20",
      status: "Concluída"
    },
    {
      id: 2,
      cliente: "Ana Santos",
      profissional: "Beatriz Santos", 
      servico: "Cronograma Capilar",
      data: "2024-01-18",
      status: "Pendente"
    },
    {
      id: 3,
      cliente: "Beatriz Costa",
      profissional: "Ana Silva",
      servico: "Tratamento Antiqueda",
      data: "2024-01-15",
      status: "Concluída"
    },
  ];

  const clientes = [
    { id: 1, nome: "Maria Silva" },
    { id: 2, nome: "Ana Santos" },
    { id: 3, nome: "Beatriz Costa" },
  ];

  const filteredFichas = fichas.filter(ficha =>
    ficha.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ficha.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Anamnese</h1>
          <p className="text-muted-foreground">Gerencie fichas de anamnese dos clientes</p>
        </div>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Ficha
        </Button>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Fichas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os clientes</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.nome}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{fichas.length}</div>
            <p className="text-sm text-muted-foreground">Total de Fichas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">
              {fichas.filter(f => f.status === "Concluída").length}
            </div>
            <p className="text-sm text-muted-foreground">Fichas Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">
              {fichas.filter(f => f.status === "Pendente").length}
            </div>
            <p className="text-sm text-muted-foreground">Fichas Pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Fichas */}
      <div className="grid gap-4">
        {filteredFichas.map((ficha) => (
          <Card key={ficha.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{ficha.cliente}</h3>
                      <p className="text-sm text-muted-foreground">{ficha.servico}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      {ficha.profissional}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(ficha.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <Badge 
                    variant={ficha.status === "Concluída" ? "default" : "secondary"}
                  >
                    {ficha.status}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFichas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma ficha encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Anamnese;