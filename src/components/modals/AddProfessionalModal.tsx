
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { secureProfessionalsService, validateInput } from "@/services/secureProfessionalsService";

interface AddProfessionalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddProfessionalModal({ open, onClose, onSuccess }: AddProfessionalModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    telefone: "",
    whatsapp: "",
    horarioInicio: "",
    horarioFim: "",
    ativo: true,
    permissoes: ["dashboard", "clients", "agenda", "anamnesis", "profile"] // Permissões padrão seguras
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validações usando o serviço seguro
      const nameValidation = validateInput.name(formData.nome);
      const emailValidation = validateInput.email(formData.email);
      const passwordValidation = validateInput.password(formData.senha);
      const phoneValidation = validateInput.phone(formData.telefone);

      // Coletar todos os erros
      const allErrors = [
        ...nameValidation.errors,
        ...emailValidation.errors,
        ...passwordValidation.errors,
        ...phoneValidation.errors
      ];

      if (allErrors.length > 0) {
        toast({
          title: "Dados inválidos!",
          description: allErrors[0], // Mostrar o primeiro erro
          variant: "destructive",
        });
        return;
      }

      // Converter permissões para o formato esperado
      const permissionsMap: Record<string, boolean> = {
        dashboard: formData.permissoes.includes("dashboard"),
        clients: formData.permissoes.includes("clients") || formData.permissoes.includes("clientes"),
        agenda: formData.permissoes.includes("agenda"),
        services: formData.permissoes.includes("services") || formData.permissoes.includes("servicos"),
        products: formData.permissoes.includes("products") || formData.permissoes.includes("produtos"),
        financial: formData.permissoes.includes("financial") || formData.permissoes.includes("financeiro"),
        anamnesis: formData.permissoes.includes("anamnesis") || formData.permissoes.includes("anamnese"),
        professionals: formData.permissoes.includes("professionals"),
        exports: formData.permissoes.includes("exports") || formData.permissoes.includes("exportacoes"),
        profile: true // Sempre dar acesso ao perfil
      };

      const result = await secureProfessionalsService.createProfessional({
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        specialty: formData.cargo,
        phone: formData.telefone,
        workStartTime: formData.horarioInicio,
        workEndTime: formData.horarioFim,
        permissions: permissionsMap
      });

      if (result.success) {
        toast({
          title: "Profissional criado com sucesso!",
          description: `${formData.nome} foi cadastrado no sistema.`,
        });
        
        // Reset form
        setFormData({
          nome: "",
          email: "",
          senha: "",
          cargo: "",
          telefone: "",
          whatsapp: "",
          horarioInicio: "",
          horarioFim: "",
          ativo: true,
          permissoes: ["dashboard", "clients", "agenda", "anamnesis", "profile"]
        });
        
        onSuccess?.();
        onClose();
      } else {
        toast({
          title: "Erro ao criar profissional",
          description: result.error || "Ocorreu um erro inesperado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating professional:', error);
      toast({
        title: "Erro ao criar profissional",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                placeholder="profissional@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha de Acesso</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-4">
            <Label>Permissões de Acesso</Label>
            <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
              {[
                { key: "dashboard", label: "Painel" },
                { key: "clients", label: "Clientes" },
                { key: "agenda", label: "Agenda" },
                { key: "anamnesis", label: "Anamnese" },
                { key: "services", label: "Serviços" },
                { key: "products", label: "Produtos" },
                { key: "financial", label: "Financeiro" },
                { key: "exports", label: "Exportações" },
              ].map((permissao) => (
                <div key={permissao.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={permissao.key}
                    checked={formData.permissoes.includes(permissao.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          permissoes: [...formData.permissoes, permissao.key]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          permissoes: formData.permissoes.filter(p => p !== permissao.key)
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={permissao.key} className="text-sm">
                    {permissao.label}
                  </Label>
                </div>
              ))}
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Adicionar Profissional"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
