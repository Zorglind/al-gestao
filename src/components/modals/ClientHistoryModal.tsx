import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Instagram,
  Briefcase,
  FileText,
  Loader2
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  profession?: string;
  instagram?: string;
  observations?: string;
  is_active: boolean;
  last_visit?: string;
  total_services: number;
  created_at: string;
}

interface AppointmentData {
  id: string;
  date: string;
  time: string;
  status: string;
  price?: number;
  notes?: string;
  service?: {
    name: string;
    category: string;
  };
  professional?: {
    name: string;
  };
}

interface ClientHistoryModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string | null;
}

export function ClientHistoryModal({ open, onClose, clientId }: ClientHistoryModalProps) {
  const [client, setClient] = useState<ClientData | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadClientData = async () => {
    if (!clientId) return;
    
    setLoading(true);
    try {
      // Load client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Load appointments - simplified query
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (appointmentsError) throw appointmentsError;
      
      // Transform the data to match our interface
      const transformedAppointments = appointmentsData?.map(apt => ({
        id: apt.id,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        price: apt.price,
        notes: apt.notes,
        service: undefined, // Will be populated separately if needed
        professional: undefined // Will be populated separately if needed
      })) || [];

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error loading client data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar o histórico do cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && clientId) {
      loadClientData();
    }
  }, [open, clientId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'scheduled': 'Agendado',
      'completed': 'Concluído',
      'cancelled': 'Cancelado',
      'no_show': 'Faltou'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const totalSpent = appointments
    .filter(apt => apt.status === 'completed' && apt.price)
    .reduce((sum, apt) => sum + (apt.price || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Histórico do Cliente
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Carregando dados do cliente...</p>
            </div>
          </div>
        ) : client ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Info */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{client.name}</span>
                  </div>
                  
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  
                  {client.profession && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.profession}</span>
                    </div>
                  )}
                  
                  {client.instagram && (
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">@{client.instagram}</span>
                    </div>
                  )}
                  
                  {client.observations && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Observações:</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">{client.observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de Atendimentos:</span>
                    <span className="font-medium">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Gasto:</span>
                    <span className="font-medium text-green-600">R$ {totalSpent.toFixed(2)}</span>
                  </div>
                  {client.last_visit && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Última Visita:</span>
                      <span className="font-medium">{formatDate(client.last_visit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cliente desde:</span>
                    <span className="font-medium">{formatDate(client.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments History */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Atendimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum atendimento encontrado</h3>
                      <p className="text-muted-foreground">Este cliente ainda não possui agendamentos.</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <Card key={appointment.id} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{formatDate(appointment.date)}</span>
                                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                                    <span>{formatTime(appointment.time)}</span>
                                  </div>
                                  {appointment.service && (
                                    <div className="text-sm text-muted-foreground">
                                      <strong>{appointment.service.name}</strong>
                                      <span className="ml-2">({appointment.service.category})</span>
                                    </div>
                                  )}
                                  {appointment.professional && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      {appointment.professional.name}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right space-y-2">
                                  <Badge className={getStatusColor(appointment.status)}>
                                    {getStatusLabel(appointment.status)}
                                  </Badge>
                                  {appointment.price && (
                                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                      <DollarSign className="h-3 w-3" />
                                      R$ {appointment.price.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {appointment.notes && (
                                <>
                                  <Separator className="my-2" />
                                  <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}