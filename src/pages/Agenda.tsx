import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Video, MapPin, Clock, MessageCircle, Bot, RefreshCw } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useStore } from "@/src/store/useStore";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  date: string;
  type: string;
  modality: string;
  status: string;
}

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { googleSyncEnabled, whatsappBotEnabled } = useStore();

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      });
  }, []);

  const selectedDayAppointments = appointments.filter(apt => 
    date && isSameDay(new Date(apt.date), date)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleWhatsAppReminder = (apt: Appointment) => {
    if (!apt.patientPhone) {
      toast.error("Número de telefone não cadastrado para este paciente.");
      return;
    }
    
    // Remove non-numeric characters and any leading zeros (e.g. 011 -> 11)
    let phone = apt.patientPhone.replace(/\D/g, '');
    phone = phone.replace(/^0+/, '');
    
    // Format date and time
    const aptDate = new Date(apt.date);
    const formattedDate = format(aptDate, "dd/MM", { locale: ptBR });
    const formattedTime = format(aptDate, "HH:mm");
    
    // Create message
    const message = `Olá, ${apt.patientName}! Passando para lembrar da nossa consulta agendada para o dia ${formattedDate} às ${formattedTime}. Por favor, confirme sua presença.`;
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)]">
      {/* Sidebar Calendar */}
      <Card className="w-full lg:w-auto h-fit shrink-0 flex justify-center lg:justify-start">
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            className="rounded-md border-0"
          />
        </CardContent>
      </Card>

      {/* Main Agenda View */}
      <Card className="flex-1 flex flex-col overflow-hidden min-h-[500px] lg:min-h-0">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <CardTitle className="text-xl sm:text-2xl">
                {date ? format(date, "EEEE, d 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {googleSyncEnabled && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Google Integrado
                  </Badge>
                )}
                {whatsappBotEnabled && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <Bot className="w-3 h-3 mr-1" />
                    Bot Ativo
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDayAppointments.length} consulta(s) agendada(s)
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando agenda...</div>
          ) : selectedDayAppointments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Nenhuma consulta</h3>
              <p className="text-sm text-muted-foreground mt-1">Você não tem agendamentos para este dia.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {selectedDayAppointments.map((apt) => (
                <div key={apt.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="w-24 shrink-0 flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                    <div className="text-lg font-bold text-foreground">
                      {format(new Date(apt.date), "HH:mm")}
                    </div>
                    <div className="text-xs text-muted-foreground">50 min</div>
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                    <div>
                      <h4 className="text-base font-semibold text-foreground">{apt.patientName}</h4>
                      <div className="flex flex-wrap items-center mt-1 gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          {apt.modality === 'ONLINE' ? <Video className="w-3.5 h-3.5 mr-1" /> : <MapPin className="w-3.5 h-3.5 mr-1" />}
                          {apt.modality === 'ONLINE' ? 'Teleconsulta' : 'Consultório 1'}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>{apt.type === 'INDIVIDUAL' ? 'Terapia Individual' : apt.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Badge variant={apt.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {apt.status === 'CONFIRMED' ? 'Confirmado' : 'Agendado'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleWhatsAppReminder(apt)}
                        title="Enviar lembrete via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">Prontuário</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
