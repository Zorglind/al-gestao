import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { profileService, ProfessionalProfile, UpdateProfileData } from "@/services/profileService";
import { servicesService, Service } from "@/services/servicesService";
import { validate } from "@/utils/inputValidation";
import { 
  User, 
  Clock, 
  Building, 
  MapPin, 
  FileText, 
  Camera, 
  Shield, 
  Settings, 
  Instagram, 
  Facebook, 
  Twitter,
  Loader2,
  Save
} from "lucide-react";

const MeuPerfil = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfessionalProfile | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  
  const [formData, setFormData] = useState({
    company_name: "",
    address: "",
    cnpj: "",
    work_start_time: "",
    work_end_time: "",
    bio: "",
  });

  const [socialNetworks, setSocialNetworks] = useState({
    instagram: "",
    facebook: "",
    twitter: ""
  });

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [offeredServices, setOfferedServices] = useState<string[]>([]);

  // Load profile data and available services
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load profile
        const profile = await profileService.getProfile();
        if (profile) {
          setProfileData(profile);
          setFormData({
            company_name: profile.company_name || "",
            address: profile.address || "",
            cnpj: profile.cnpj || "",
            work_start_time: profile.work_start_time || "",
            work_end_time: profile.work_end_time || "",
            bio: profile.bio || "",
          });
          setSocialNetworks(profile.social_networks || {
            instagram: "",
            facebook: "",
            twitter: ""
          });
          setTheme(profile.theme);
          setNotifications(profile.notifications_enabled);
          setProfilePhoto(profile.avatar_url || "");
          setOfferedServices(profile.offered_services?.map((s: any) => s.id) || []);
        }

        // Load available services
        const services = await servicesService.getAll();
        setAvailableServices(services);
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do perfil.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setOfferedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSocialChange = (platform: string, username: string) => {
    setSocialNetworks(prev => ({
      ...prev,
      [platform]: username
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      
      // Validate file before upload
      const fileValidation = validate.file(file);
      if (!fileValidation.isValid) {
        toast({
          title: "Arquivo inválido",
          description: fileValidation.error,
          variant: "destructive",
        });
        return;
      }
      
      const avatarUrl = await profileService.uploadAvatar(file);
      setProfilePhoto(avatarUrl);
      
      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da foto.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData: UpdateProfileData = {
        ...formData,
        social_networks: socialNetworks,
        theme,
        notifications_enabled: notifications,
        avatar_url: profilePhoto,
        offered_services: offeredServices.map(id => ({ id }))
      };

      await profileService.updateProfile(updateData);
      
      toast({
        title: "Perfil salvo!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nome da Empresa</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    placeholder="Digite o nome da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Digite o endereço completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Fale um pouco sobre você e sua experiência"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work_start_time">Início</Label>
                  <Input
                    id="work_start_time"
                    type="time"
                    value={formData.work_start_time}
                    onChange={(e) => handleInputChange("work_start_time", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work_end_time">Fim</Label>
                  <Input
                    id="work_end_time"
                    type="time"
                    value={formData.work_end_time}
                    onChange={(e) => handleInputChange("work_end_time", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offered Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Serviços Oferecidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.category}</p>
                    </div>
                    <Switch
                      checked={offeredServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Foto do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profilePhoto} />
                <AvatarFallback>
                  {user?.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </span>
                  </Button>
                </Label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tipo de Usuário:</span>
                <Badge variant="outline">{profile?.role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Especialidade:</span>
                <span className="text-sm text-muted-foreground">{profile?.specialty || "Não informado"}</span>
              </div>
            </CardContent>
          </Card>

          {/* System Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferências do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">Aparência do sistema</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações</Label>
                  <p className="text-sm text-muted-foreground">Receber alertas</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">@</span>
                  <Input
                    id="instagram"
                    className="rounded-l-none"
                    value={socialNetworks.instagram}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                    placeholder="seuperfil"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={socialNetworks.facebook}
                  onChange={(e) => handleSocialChange("facebook", e.target.value)}
                  placeholder="Seu perfil no Facebook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">@</span>
                  <Input
                    id="twitter"
                    className="rounded-l-none"
                    value={socialNetworks.twitter}
                    onChange={(e) => handleSocialChange("twitter", e.target.value)}
                    placeholder="seuperfil"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;