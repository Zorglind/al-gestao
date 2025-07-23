
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface AddProfessionalModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProfessionalModal({ open, onClose }: AddProfessionalModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "",
    telefone: "",
    whatsapp: "",
    horarioInicio: "",
    horarioFim: "",
    ativo: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do profissional:", formData);
    
    toast({
      title: "Profissional adicionado com sucesso!",
      description: `${formData.nome} foi cadastrado no sistema.`,
    });
    
    // Reset form
    setFormData({
      nome: "",
      email: "",
      cargo: "",
      telefone: "",
      whatsapp: "",
      horarioInicio: "",
      horarioFim: "",
      ativo: true
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Profissional</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo/Função</Label>
            <Select value={formData.cargo} onValueChange={(value) => setFormData({...formData, cargo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tricologista">Tricologista</SelectItem>
                <SelectItem value="cabeleireira">Cabeleireira</SelectItem>
                <SelectItem value="esteticista">Esteticista</SelectItem>
                <SelectItem value="terapeuta">Terapeuta</SelectItem>
                <SelectItem value="recepcionista">Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horarioInicio">Horário de Início</Label>
              <Input
                id="horarioInicio"
                type="time"
                value={formData.horarioInicio}
                onChange={(e) => setFormData({...formData, horarioInicio: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horarioFim">Horário de Término</Label>
              <Input
                id="horarioFim"
                type="time"
                value={formData.horarioFim}
                onChange={(e) => setFormData({...formData, horarioFim: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ativo">Profissional Ativo</Label>
            <Switch 
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Profissional
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
