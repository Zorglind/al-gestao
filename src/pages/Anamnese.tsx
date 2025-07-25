import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  User, 
  Settings,
  MessageSquare,
  Mail,
  Printer
} from "lucide-react";
import { AnamneseTemplate, AnamneseResponse } from "@/types/anamnese";
import { FormBuilder } from "@/components/anamnese/FormBuilder";
import { FormFillModal } from "@/components/anamnese/FormFillModal";
import { useToast } from "@/hooks/use-toast";

export default function Anamnese() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showFillModal, setShowFillModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AnamneseTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<AnamneseTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseSearchTerm, setResponseSearchTerm] = useState("");

  // Templates de anamnese
  const [templates, setTemplates] = useState<AnamneseTemplate[]>([
    {
      id: "template_1",
      name: "Anamnese Capilar Básica",
      description: "Formulário básico para avaliação capilar inicial",
      fields: [
        {
          id: "field_1",
          type: "text",
          label: "Nome Completo",
          required: true,
          order: 0
        },
        {
          id: "field_2", 
          type: "textarea",
          label: "Queixa Principal",
          instructions: "Descreva o principal problema capilar",
          required: true,
          order: 1
        }
      ],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      isActive: true
    }
  ]);

  // Respostas de anamnese
  const [responses, setResponses] = useState<AnamneseResponse[]>([
    {
      id: "response_1",
      templateId: "template_1",
      templateName: "Anamnese Capilar Básica",
      clientId: "1",
      clientName: "Maria Silva",
      professionalId: "1",
      professionalName: "Dr. Carlos Lima",
      serviceId: "1",
      serviceName: "Consulta Tricológica",
      responses: {
        field_1: "Maria Silva",
        field_2: "Queda de cabelo excessiva há 3 meses"
      },
      completedAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-15")
    }
  ]);

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResponses = responses.filter(response =>
    response.clientName.toLowerCase().includes(responseSearchTerm.toLowerCase()) ||
    response.templateName.toLowerCase().includes(responseSearchTerm.toLowerCase())
  );

  const handleSaveTemplate = (template: AnamneseTemplate) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
      toast({
        title: "Template atualizado!",
        description: `Template "${template.name}" foi atualizado com sucesso.`
      });
    } else {
      setTemplates(prev => [...prev, template]);
      toast({
        title: "Template criado!",
        description: `Template "${template.name}" foi criado com sucesso.`
      });
    }
    setShowFormBuilder(false);
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: AnamneseTemplate) => {
    // Verificar se template tem respostas
    const hasResponses = responses.some(r => r.templateId === template.id);
    if (hasResponses) {
      toast({
        title: "Não é possível editar",
        description: "Este template possui respostas vinculadas e não pode ser editado.",
        variant: "destructive"
      });
      return;
    }
    setEditingTemplate(template);
    setShowFormBuilder(true);
  };

  const handleFillTemplate = (template: AnamneseTemplate) => {
    setSelectedTemplate(template);
    setShowFillModal(true);
  };

  const handleSaveResponse = (response: AnamneseResponse) => {
    setResponses(prev => [...prev, response]);
    setShowFillModal(false);
    setSelectedTemplate(null);
  };

  const handleShareWhatsApp = (response: AnamneseResponse) => {
    const message = `Anamnese: ${response.templateName}\nCliente: ${response.clientName}\nData: ${response.completedAt.toLocaleDateString()}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareEmail = (response: AnamneseResponse) => {
    const subject = `Anamnese - ${response.clientName}`;
    const body = `Anamnese: ${response.templateName}\nCliente: ${response.clientName}\nData: ${response.completedAt.toLocaleDateString()}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handlePrintPDF = (response: AnamneseResponse) => {
    toast({
      title: "Gerando PDF...",
      description: "O arquivo será baixado automaticamente."
    });
    // Implementar geração de PDF real aqui
  };

  if (showFormBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => {
            setShowFormBuilder(false);
            setEditingTemplate(null);
          }}>
            ← Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
            </h1>
            <p className="text-muted-foreground">
              Configure os campos do formulário de anamnese
            </p>
          </div>
        </div>
        
        <FormBuilder
          template={editingTemplate || undefined}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowFormBuilder(false);
            setEditingTemplate(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fichas de Anamnese</h1>
          <p className="text-muted-foreground">
            Gerencie templates e respostas de anamnese
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="responses">Formulários Respondidos</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowFormBuilder(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{template.name}</span>
                    <Badge variant="outline">{template.fields.length} campos</Badge>
                  </CardTitle>
                  {template.description && (
                    <CardDescription>{template.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFillTemplate(template)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Preencher
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Crie seu primeiro template de anamnese personalizado.
                  </p>
                  <Button onClick={() => setShowFormBuilder(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou template..."
                value={responseSearchTerm}
                onChange={(e) => setResponseSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredResponses.length} formulário(s) respondido(s)
            </div>
          </div>

          <div className="space-y-4">
            {filteredResponses.map((response) => (
              <Card key={response.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{response.clientName}</span>
                        <Badge variant="default">Concluído</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>Template: {response.templateName}</span>
                          <span>•</span>
                          <span>Profissional: {response.professionalName}</span>
                        </div>
                        {response.serviceName && (
                          <div className="mt-1">
                            Serviço: {response.serviceName}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{response.completedAt.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShareWhatsApp(response)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShareEmail(response)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePrintPDF(response)}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResponses.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum formulário respondido</h3>
                  <p className="text-muted-foreground mb-4">
                    Os formulários preenchidos aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <FormFillModal
          open={showFillModal}
          onClose={() => {
            setShowFillModal(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSave={handleSaveResponse}
        />
      )}
    </div>
  );
}