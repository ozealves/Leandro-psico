import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/src/store/useStore";
import { User, Bell, Shield, Palette, Link2, Calendar as CalendarIcon, MessageCircle, Check, X, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { 
    user, 
    theme,
    setTheme,
    googleSyncEnabled: googleSync, 
    setGoogleSyncEnabled: setGoogleSync, 
    whatsappBotEnabled: whatsappBot, 
    setWhatsappBotEnabled: setWhatsappBot 
  } = useStore();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isActivatingWhatsapp, setIsActivatingWhatsapp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const newPassword = watch("newPassword");

  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 8) strength += 20;
    if (/[A-Z]/.test(newPassword)) strength += 20;
    if (/[a-z]/.test(newPassword)) strength += 20;
    if (/[0-9]/.test(newPassword)) strength += 20;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 20;
    return strength;
  }, [newPassword]);

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 20) return "bg-red-500";
    if (passwordStrength <= 40) return "bg-orange-500";
    if (passwordStrength <= 60) return "bg-yellow-500";
    if (passwordStrength <= 80) return "bg-lime-500";
    return "bg-green-500";
  }, [passwordStrength]);

  const strengthLabel = useMemo(() => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 20) return "Muito fraca";
    if (passwordStrength <= 40) return "Fraca";
    if (passwordStrength <= 60) return "Média";
    if (passwordStrength <= 80) return "Forte";
    return "Muito forte";
  }, [passwordStrength]);

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Password updated:", data);
      toast.success("Senha atualizada com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro ao atualizar senha. Verifique se a senha atual está correta.");
    }
  };

  const handleGoogleSyncToggle = (checked: boolean) => {
    if (checked) {
      toast.info("Redirecionando para autenticação do Google...");
      setTimeout(() => {
        setGoogleSync(true);
        toast.success("Agenda do Google sincronizada com sucesso!");
      }, 1500);
    } else {
      setGoogleSync(false);
      toast.success("Sincronização com Google Agenda desativada.");
    }
  };

  const handleWhatsappBotToggle = (checked: boolean) => {
    if (checked) {
      setIsActivatingWhatsapp(true);
      const loadingToastId = toast.loading("Conectando ao serviço de WhatsApp...");
      
      setTimeout(() => {
        setWhatsappBot(true);
        setIsActivatingWhatsapp(false);
        toast.success("Bot de lembretes automáticos ativado!", {
          id: loadingToastId,
          description: "Seus pacientes receberão lembretes 24h antes das consultas.",
          icon: <Sparkles className="w-4 h-4 text-green-500" />
        });
      }, 2500);
    } else {
      setWhatsappBot(false);
      toast.success("Bot do WhatsApp desativado.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h2>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 hidden sm:flex">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 hidden sm:flex">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Integrações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="role">Cargo / Especialidade</Label>
                <Input id="role" defaultValue="Psicólogo Clínico" />
              </div>
              <Button className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1 text-left">
                  <h4 className="font-medium">Tema do Sistema</h4>
                  <p className="text-sm text-muted-foreground mr-4">Escolha entre o tema claro, escuro ou siga a preferência do sistema.</p>
                </div>
                <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Escolha como você deseja ser notificado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="text-left">
                  <h4 className="font-medium">Lembretes de Consulta</h4>
                  <p className="text-sm text-muted-foreground">Receba alertas sobre próximas consultas.</p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <form onSubmit={handleSubmit(onPasswordSubmit)}>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Gerencie sua senha e configurações de segurança. Para sua proteção, use uma senha forte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 text-left">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showCurrentPassword ? "text" : "password"} 
                      {...register("currentPassword")}
                      className={cn(errors.currentPassword && "border-destructive focus-visible:ring-destructive")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-xs text-destructive mt-1 font-medium">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={showNewPassword ? "text" : "password"} 
                        {...register("newPassword")}
                        className={cn(errors.newPassword && "border-destructive focus-visible:ring-destructive")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-destructive mt-1 font-medium">{errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Força da senha:</span>
                        <span className="font-medium">{strengthLabel}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-300", strengthColor)}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                        <PasswordCriterion label="Mínimo de 8 caracteres" met={newPassword.length >= 8} />
                        <PasswordCriterion label="Uma letra maiúscula" met={/[A-Z]/.test(newPassword)} />
                        <PasswordCriterion label="Uma letra minúscula" met={/[a-z]/.test(newPassword)} />
                        <PasswordCriterion label="Um número" met={/[0-9]/.test(newPassword)} />
                        <PasswordCriterion label="Um caractere especial" met={/[^A-Za-z0-9]/.test(newPassword)} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-left">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...register("confirmPassword")}
                        className={cn(errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1 font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-6 border-t bg-muted/20">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Atualizando..." : "Atualizar Senha"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Conecte serviços externos para automatizar sua clínica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Calendar Sync */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium flex items-center gap-2">
                      Google Agenda
                      {googleSync && <Badge variant="default" className="bg-green-600">Conectado</Badge>}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 text-left">
                      Sincronize seus agendamentos automaticamente com sua conta Google. Entradas criadas aqui aparecerão no seu Google Agenda e vice-versa.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Label htmlFor="google-sync-toggle" className="sr-only">Ativar Google Agenda</Label>
                  <Switch 
                    id="google-sync-toggle" 
                    checked={googleSync} 
                    onCheckedChange={handleGoogleSyncToggle} 
                  />
                </div>
              </div>

              {/* WhatsApp Bot */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                <div className="flex items-start gap-4 text-left">
                  <div className="p-2 bg-muted rounded-full">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      Bot do WhatsApp (Lembretes)
                      <AnimatePresence>
                        {whatsappBot && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <Badge variant="default" className="bg-green-600 gap-1">
                              <Check className="w-3 h-3" />
                              Ativo
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Envie lembretes automáticos para seus pacientes 24 horas antes da consulta. Requer plano Premium.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Label htmlFor="whatsapp-bot-toggle" className="sr-only">Ativar Bot WhatsApp</Label>
                  {isActivatingWhatsapp && (
                    <div className="flex items-center gap-1 text-xs text-primary animate-pulse font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Configurando...
                    </div>
                  )}
                  <Switch 
                    id="whatsapp-bot-toggle" 
                    checked={whatsappBot} 
                    onCheckedChange={handleWhatsappBotToggle}
                    disabled={isActivatingWhatsapp}
                  />
                </div>
              </div>

              {/* Notice regarding API keys */}
              <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground mt-6 text-left">
                <p><strong>Nota técnica:</strong> Para habilitar estas integrações reais em um ambiente de produção, é necessário configurar credenciais OAuth do Google Cloud e uma chave de API para o WhatsApp (ex: Twilio ou Meta Graph API) nas variáveis de ambiente do seu servidor.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PasswordCriterion({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground/50" />
      )}
      <span className={cn("transition-colors", met ? "text-green-600 font-medium" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}
