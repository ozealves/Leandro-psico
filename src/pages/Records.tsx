import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Lock, Clock, Bold, Italic, List, ListOrdered } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Record {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  content: string;
  psychologist: string;
}

interface Patient {
  id: string;
  name: string;
}

const formSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente"),
  content: z.string().min(10, "A evolução deve ter pelo menos 10 caracteres"),
});

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 border-b border-border bg-muted/30 rounded-t-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        className={editor.isActive('bold') ? 'bg-muted' : ''}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function Records() {
  const [records, setRecords] = useState<Record[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      content: "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Descreva a evolução clínica do paciente...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      form.setValue('content', editor.getHTML());
      form.trigger('content');
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none',
      },
    },
  });

  const fetchRecords = () => {
    setLoading(true);
    fetch('/api/records')
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        if (data.length > 0 && !selectedRecord) {
          setSelectedRecord(data[0]);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecords();
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data));
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const patient = patients.find(p => p.id === values.patientId);
    
    fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        patientName: patient?.name || 'Desconhecido',
      }),
    })
      .then(res => res.json())
      .then((newRecord) => {
        toast.success("Evolução salva com sucesso!");
        setOpen(false);
        form.reset();
        editor?.commands.setContent('');
        fetchRecords();
        setSelectedRecord(newRecord);
      })
      .catch(() => {
        toast.error("Erro ao salvar evolução.");
      });
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          record.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPatient = selectedPatientId === "all" || record.patientId === selectedPatientId;
    return matchesSearch && matchesPatient;
  });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar prontuário..." 
              className="pl-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Filtrar por paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os pacientes</SelectItem>
              {patients.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button />}>
            <FileText className="w-4 h-4 mr-2" />
            Nova Evolução
          </SheetTrigger>
          <SheetContent className="sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nova Evolução Clínica</SheetTitle>
              <SheetDescription>
                Registre a evolução do paciente. Este documento é sigiloso.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paciente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patients.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={() => (
                      <FormItem>
                        <FormLabel>Evolução</FormLabel>
                        <FormControl>
                          <div className="border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                            <MenuBar editor={editor} />
                            <EditorContent editor={editor} className="bg-background" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit">Assinar e Salvar</Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Lista de Pacientes / Prontuários Recentes */}
        <Card className="w-1/3 flex flex-col overflow-hidden">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-lg">Evoluções Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Carregando...</div>
            ) : (
              <div className="divide-y divide-border">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors border-l-2 ${selectedRecord?.id === record.id ? 'border-primary bg-muted/30' : 'border-transparent hover:border-primary/50'}`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-foreground">{record.patientName}</h4>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(record.date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div 
                        className="text-sm text-muted-foreground line-clamp-2 prose-sm"
                        dangerouslySetInnerHTML={{ __html: record.content }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground italic">
                    Nenhum prontuário encontrado para estes filtros.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visualização do Prontuário */}
        <Card className="flex-1 flex flex-col overflow-hidden bg-muted/30">
          {selectedRecord ? (
            <>
              <CardHeader className="border-b bg-card py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedRecord.patientName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Acesso restrito • {selectedRecord.psychologist}
                  </p>
                </div>
                <Button variant="outline" size="sm">Exportar PDF</Button>
              </CardHeader>
              <CardContent className="p-6 overflow-auto flex-1">
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Sessão */}
                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                      <h3 className="font-semibold text-lg">Evolução Clínica</h3>
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {format(new Date(selectedRecord.date), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <div 
                      className="prose dark:prose-invert max-w-none text-card-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedRecord.content }}
                    />
                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        Assinado digitalmente por {selectedRecord.psychologist}
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Finalizado
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione um prontuário para visualizar
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
