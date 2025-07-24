import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AddAnamneseModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddAnamneseModal({ open, onClose }: AddAnamneseModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clienteNome: "",
    idade: "",
    telefone: "",
    queixaPrincipal: "",
    historicoFamiliar: "",
    medicamentos: "",
    alergias: "",
    tratamentosAnteriores: "",
    observacoes: "",
    assinaturaDigital: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assinaturaDigital) {
      toast({
        title: "Erro de validação",
        description: "É necessário assinar digitalmente a ficha de anamnese.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Ficha de anamnese criada:", formData);
    
    toast({
      title: "Ficha criada!",
      description: `Ficha de anamnese de ${formData.clienteNome} foi criada com sucesso.`,
    });
    
    setFormData({
      clienteNome: "",
      idade: "",
      telefone: "",
      queixaPrincipal: "",
      historicoFamiliar: "",
      medicamentos: "",
      alergias: "",
      tratamentosAnteriores: "",
      observacoes: "",
      assinaturaDigital: false
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ficha de Anamnese</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clienteNome">Nome do Cliente *</Label>
              <Input
                id="clienteNome"
                value={formData.clienteNome}
                onChange={(e) => setFormData({...formData, clienteNome: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                value={formData.idade}
                onChange={(e) => setFormData({...formData, idade: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="queixaPrincipal">Queixa Principal *</Label>
            <Textarea
              id="queixaPrincipal"
              value={formData.queixaPrincipal}
              onChange={(e) => setFormData({...formData, queixaPrincipal: e.target.value})}
              placeholder="Descreva a queixa principal do cliente"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="historicoFamiliar">Histórico Familiar</Label>
            <Textarea
              id="historicoFamiliar"
              value={formData.historicoFamiliar}
              onChange={(e) => setFormData({...formData, historicoFamiliar: e.target.value})}
              placeholder="Histórico de problemas capilares na família"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicamentos">Medicamentos em Uso</Label>
              <Textarea
                id="medicamentos"
                value={formData.medicamentos}
                onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
                placeholder="Liste os medicamentos em uso"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alergias">Alergias Conhecidas</Label>
              <Textarea
                id="alergias"
                value={formData.alergias}
                onChange={(e) => setFormData({...formData, alergias: e.target.value})}
                placeholder="Liste alergias conhecidas"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tratamentosAnteriores">Tratamentos Anteriores</Label>
            <Textarea
              id="tratamentosAnteriores"
              value={formData.tratamentosAnteriores}
              onChange={(e) => setFormData({...formData, tratamentosAnteriores: e.target.value})}
              placeholder="Tratamentos capilares realizados anteriormente"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações importantes"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="assinaturaDigital"
              checked={formData.assinaturaDigital}
              onCheckedChange={(checked) => setFormData({...formData, assinaturaDigital: checked as boolean})}
            />
            <Label htmlFor="assinaturaDigital" className="text-sm">
              Eu autorizo o preenchimento desta ficha de anamnese e confirmo que as informações são verdadeiras. (Assinatura Digital) *
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Ficha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}