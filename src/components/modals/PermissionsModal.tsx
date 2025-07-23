
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface PermissionsModalProps {
  open: boolean;
  onClose: () => void;
  professionalName: string;
}

export function PermissionsModal({ open, onClose, professionalName }: PermissionsModalProps) {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState({
    painel: true,
    clientes: true,
    agenda: true,
    servicos: false,
    produtos: false,
    anamnese: true,
    financeiro: false,
    exportacoes: false,
    meuPerfil: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Permissões atualizadas:", permissions);
    
    toast({
      title: "Permissões atualizadas!",
      description: `As permissões de ${professionalName} foram salvas.`,
    });
    
    onClose();
  };

  const permissionLabels = {
    painel: "Painel",
    clientes: "Clientes",
    agenda: "Agenda",
    servicos: "Serviços",
    produtos: "Produtos",
    anamnese: "Anamnese",
    financeiro: "Financeiro",
    exportacoes: "Exportações",
    meuPerfil: "Meu Perfil"
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Permissões - {professionalName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{permissionLabels[key as keyof typeof permissionLabels]}</Label>
                <Switch 
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => setPermissions({...permissions, [key]: checked})}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Permissões
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
