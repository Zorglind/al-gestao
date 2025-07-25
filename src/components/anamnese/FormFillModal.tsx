import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AnamneseTemplate, AnamneseResponse, FieldValue } from "@/types/anamnese";
import { FieldPreview } from "./FieldPreview";
import { SignatureModal } from "./SignatureModal";

interface FormFillModalProps {
  open: boolean;
  onClose: () => void;
  template: AnamneseTemplate;
  onSave: (response: AnamneseResponse) => void;
}

const mockClients = [
  { id: "1", name: "Maria Silva" },
  { id: "2", name: "João Santos" },
  { id: "3", name: "Ana Costa" }
];

const mockProfessionals = [
  { id: "1", name: "Dr. Carlos Lima" },
  { id: "2", name: "Dra. Paula Medeiros" }
];

const mockServices = [
  { id: "1", name: "Consulta Tricológica" },
  { id: "2", name: "Tratamento Capilar" },
  { id: "3", name: "Implante Capilar" }
];

export function FormFillModal({ open, onClose, template, onSave }: FormFillModalProps) {
  const { toast } = useToast();
  const [clientId, setClientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentSignatureField, setCurrentSignatureField] = useState<string>("");

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSignatureField = (fieldId: string) => {
    setCurrentSignatureField(fieldId);
    setShowSignatureModal(true);
  };

  const handleSignatureSave = (signatureData: string) => {
    handleFieldChange(currentSignatureField, signatureData);
    setShowSignatureModal(false);
    setCurrentSignatureField("");
  };

  const validateForm = () => {
    const requiredFields = template.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => 
      !responses[field.id] || 
      (Array.isArray(responses[field.id]) && responses[field.id].length === 0)
    );

    if (!clientId || !professionalId) {
      toast({
        title: "Erro de validação",
        description: "Cliente e profissional são obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    if (missingFields.length > 0) {
      toast({
        title: "Erro de validação",
        description: `Os seguintes campos obrigatórios não foram preenchidos: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedClient = mockClients.find(c => c.id === clientId);
    const selectedProfessional = mockProfessionals.find(p => p.id === professionalId);
    const selectedService = mockServices.find(s => s.id === serviceId);

    const response: AnamneseResponse = {
      id: `response_${Date.now()}`,
      templateId: template.id,
      templateName: template.name,
      clientId,
      clientName: selectedClient?.name || "",
      professionalId,
      professionalName: selectedProfessional?.name || "",
      serviceId: serviceId || undefined,
      serviceName: selectedService?.name || undefined,
      responses,
      completedAt: new Date(),
      createdAt: new Date()
    };

    onSave(response);
    
    toast({
      title: "Formulário salvo!",
      description: `Anamnese de ${selectedClient?.name} foi salva com sucesso.`,
    });

    // Reset form
    setClientId("");
    setProfessionalId("");
    setServiceId("");
    setResponses({});
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preencher: {template.name}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="professional">Profissional *</Label>
                <Select value={professionalId} onValueChange={setProfessionalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProfessionals.map(professional => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Serviço (Opcional)</Label>
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {template.fields.map((field) => (
                <div key={field.id}>
                  {field.type === 'signature' ? (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-destructive">*</span>}
                      </Label>
                      {field.instructions && (
                        <p className="text-sm text-muted-foreground">{field.instructions}</p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSignatureField(field.id)}
                        className="w-full h-20 border-dashed"
                      >
                        {responses[field.id] ? 'Assinatura capturada - Clique para alterar' : 'Clique para assinar'}
                      </Button>
                    </div>
                  ) : (
                    <FieldPreview
                      field={field}
                      value={responses[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Anamnese
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SignatureModal
        open={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignatureSave}
      />
    </>
  );
}