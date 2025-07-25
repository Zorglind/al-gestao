import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Building, Phone, Mail, MapPin, Palette, Clock, Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BRAND } from "@/constants/branding";
import * as React from "react";

const MeuPerfil = () => {
  const { toast } = useToast();
  const [tema, setTema] = useState("claro");
  const [notificacoes, setNotificacoes] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  // Load profile photo from localStorage on mount
  React.useEffect(() => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);
  
  const [perfil, setPerfil] = useState({
    nome: "Ana Silva",
    empresa: BRAND.name,
    email: "ana@algestao.com.br",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    cnpj: "12.345.678/0001-90",
    horarioInicio: "08:00",
    horarioFim: "18:00",
    bio: "Profissional especializada em gestão e atendimento empresarial com foco em excelência operacional."
  });

  const servicosOferecidos = [
    { id: "hidratacao", label: "Hidratação Intensiva", ativo: true },
    { id: "cronograma", label: "Cronograma Capilar", ativo: true },
    { id: "corte", label: "Corte Especializado", ativo: false },
    { id: "antiqueda", label: "Tratamento Antiqueda", ativo: true },
    { id: "nutricao", label: "Nutrição Capilar", ativo: true },
  ];

  const redesSociais = [
    { rede: "Instagram", usuario: "@algestao_interna" },
    { rede: "WhatsApp", usuario: "(11) 99999-9999" },
    { rede: "Facebook", usuario: BRAND.name },
  ];

  const handleInputChange = (field: string, value: string) => {
    setPerfil(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Perfil salvo:", perfil);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setProfilePhoto(result);
          localStorage.setItem('profilePhoto', result);
          toast({
            title: "Foto atualizada!",
            description: "Sua foto de perfil foi alterada com sucesso.",
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
        </div>
        <Button variant="default" className="flex items-center gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={perfil.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nome da Empresa</Label>
                  <Input
                    id="empresa"
                    value={perfil.empresa}
                    onChange={(e) => handleInputChange('empresa', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfil.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={perfil.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={perfil.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={perfil.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia Profissional</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre sua experiência profissional..."
                  value={perfil.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Horários de Atendimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horários de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horário de Início</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={perfil.horarioInicio}
                    onChange={(e) => handleInputChange('horarioInicio', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horário de Término</Label>
                  <Input
                    id="horarioFim"
                    type="time"
                    value={perfil.horarioFim}
                    onChange={(e) => handleInputChange('horarioFim', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Serviços Oferecidos */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Oferecidos</CardTitle>
              <CardDescription>
                Selecione os serviços que você oferece aos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {servicosOferecidos.map((servico) => (
                  <div key={servico.id} className="flex items-center justify-between">
                    <Label htmlFor={servico.id} className="text-sm font-medium">
                      {servico.label}
                    </Label>
                    <Switch id={servico.id} checked={servico.ativo} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Foto de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profilePhoto} />
                <AvatarFallback className="text-lg">AS</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="w-full" onClick={handlePhotoUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Alterar Foto
              </Button>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tema">Tema</Label>
                <Select value={tema} onValueChange={setTema}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claro">Claro</SelectItem>
                    <SelectItem value="escuro">Escuro</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notificacoes" className="text-sm font-medium">
                  Notificações
                </Label>
                <Switch 
                  id="notificacoes" 
                  checked={notificacoes}
                  onCheckedChange={setNotificacoes}
                />
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {redesSociais.map((rede, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{rede.rede}</Label>
                  <Input
                    value={rede.usuario}
                    onChange={() => {}}
                    className="text-sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;