import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  MessageCircle,
  Edit,
  Loader2
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface AppointmentDetails {
  id: string;
  date: string;
  time: string;
  status: string;
  price?: number;
  notes?: string;
  client: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  service?: {
    name: string;
    category: string;
    duration: number;
  };
  professional?: {
    name: string;
  };
}

interface AppointmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  appointmentId: string | null;
}

export function AppointmentDetailsModal({ open, onClose, appointmentId }: AppointmentDetailsModalProps) {
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadAppointmentDetails = async () => {
    if (!appointmentId) return;
    
    setLoading(true);
    try {
      // Get appointment data
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (appointmentError) throw appointmentError;

      // Get client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, name, phone, email')
        .eq('id', appointmentData.client_id)
        .single();

      if (clientError) throw clientError;

      // Transform the data to match our interface
      const appointmentDetails: AppointmentDetails = {
        id: appointmentData.id,
        date: appointmentData.date,
        time: appointmentData.time,
        status: appointmentData.status,
        price: appointmentData.price,
        notes: appointmentData.notes,
        client: {
          id: clientData.id,
          name: clientData.name,
          phone: clientData.phone,
          email: clientData.email
        },
        service: undefined, // Will be populated separately if needed
        professional: undefined // Will be populated separately if needed
      };

      setAppointment(appointmentDetails);
    } catch (error) {
      console.error('Error loading appointment details:', error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível carregar os detalhes do agendamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && appointmentId) {
      loadAppointmentDetails();
    }
  }, [open, appointmentId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const handleWhatsApp = () => {
    if (!appointment?.client.phone) {
      toast({
        title: "Telefone não cadastrado",
        description: "Este cliente não possui telefone cadastrado.",
        variant: "destructive"
      });
      return;
    }

    const phone = appointment.client.phone.replace(/\D/g, ''); // Remove non-digits
    const message = encodeURIComponent(
      `Olá ${appointment.client.name}! ` +
      `Gostaríamos de confirmar seu agendamento para ${formatDate(appointment.date)} às ${formatTime(appointment.time)}` +
      `${appointment.service ? ` para ${appointment.service.name}` : ''}. ` +
      `Aguardamos você! 😊`
    );
    
    const whatsappUrl = `https://wa.me/55${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Carregando detalhes...</p>
            </div>
          </div>
        ) : appointment ? (
          <div className="space-y-6">
            {/* Main Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-lg font-semibold">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg">{formatTime(appointment.time)}</span>
                      {appointment.service && (
                        <span className="text-muted-foreground">
                          ({appointment.service.duration} min)
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>

                <Separator className="my-4" />

                {/* Client Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Cliente</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{appointment.client.name}</span>
                  </div>
                  {appointment.client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.client.phone}</span>
                    </div>
                  )}
                  {appointment.client.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{appointment.client.email}</span>
                    </div>
                  )}
                </div>

                {appointment.service && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Serviço</h3>
                      <div>
                        <p className="font-medium">{appointment.service.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service.category}</p>
                      </div>
                    </div>
                  </>
                )}

                {appointment.professional && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Profissional</h3>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.professional.name}</span>
                      </div>
                    </div>
                  </>
                )}

                {appointment.price && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Valor</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          R$ {appointment.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {appointment.notes && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Observações</h3>
                      <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleWhatsApp}
                className="flex items-center gap-2"
                disabled={!appointment.client.phone}
              >
                <MessageCircle className="h-4 w-4" />
                Enviar WhatsApp
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
                <Button variant="default" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}