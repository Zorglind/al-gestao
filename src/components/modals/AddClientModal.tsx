import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { clientsService } from "@/services/clientsService";
import { Loader2 } from "lucide-react";
import { validate, sanitize, formatters } from "@/utils/inputValidation";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export function AddClientModal({ open, onClose, onClientAdded }: AddClientModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    profissao: "",
    redesSociais: "",
    observacoes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const nameValidation = validate.name(formData.nome);
    const phoneValidation = validate.phone(formData.telefone);
    const emailValidation = formData.email ? validate.email(formData.email) : { isValid: true };
    const cpfValidation = validate.cpf(formData.cpf);

    const validationErrors = [
      !nameValidation.isValid && nameValidation.error,
      !phoneValidation.isValid && phoneValidation.error,
      !emailValidation.isValid && emailValidation.error,
      !cpfValidation.isValid && cpfValidation.error
    ].filter(Boolean);

    if (validationErrors.length > 0) {
      toast({
        title: "Dados inválidos",
        description: validationErrors[0] as string,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await clientsService.create({
        name: sanitize.string(formData.nome),
        phone: sanitize.phone(formData.telefone),
        email: formData.email ? sanitize.email(formData.email) : null,
        cpf: formData.cpf ? sanitize.string(formData.cpf) : null,
        profession: formData.profissao ? sanitize.string(formData.profissao) : null,
        instagram: formData.redesSociais ? sanitize.string(formData.redesSociais) : null,
        observations: formData.observacoes ? sanitize.string(formData.observacoes) : null,
      });

      toast({
        title: "Cliente adicionado com sucesso!",
        description: `${formData.nome} foi cadastrado no sistema.`,
      });
      
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        cpf: "",
        profissao: "",
        redesSociais: "",
        observacoes: ""
      });
      
      onClientAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatters.phone(e.target.value);
                  setFormData({...formData, telefone: formatted});
                }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => {
                  const formatted = formatters.cpf(e.target.value);
                  setFormData({...formData, cpf: formatted});
                }}
                maxLength={14}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={formData.profissao}
                onChange={(e) => setFormData({...formData, profissao: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redesSociais">Redes Sociais</Label>
              <Input
                id="redesSociais"
                value={formData.redesSociais}
                onChange={(e) => setFormData({...formData, redesSociais: e.target.value})}
                placeholder="@instagram"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}