import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, FileText, Instagram, Calendar, Shield } from "lucide-react";
import { Client } from "@/services/clientsService";

interface ViewClientModalProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
}

export function ViewClientModal({ open, onClose, client }: ViewClientModalProps) {
  if (!client) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro do Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header com avatar e informações principais */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={client.avatar_url || ""} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{client.name}</h3>
                    <Badge variant={client.is_active ? "default" : "secondary"}>
                      {client.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Cliente desde {formatDate(client.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      {client.total_services} serviços realizados
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Informações de contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{client.phone || "Não informado"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">E-mail</p>
                    <p className="text-sm text-muted-foreground">{client.email || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">CPF</p>
                  <p className="text-sm text-muted-foreground">{client.cpf || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Profissão</p>
                  <p className="text-sm text-muted-foreground">{client.profession || "Não informada"}</p>
                </div>
              </div>
              
              {client.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">{client.instagram}</p>
                  </div>
                </div>
              )}

              {client.last_visit && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Última Visita</p>
                    <p className="text-sm text-muted-foreground">{formatDate(client.last_visit)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          {client.observations && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {client.observations}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}