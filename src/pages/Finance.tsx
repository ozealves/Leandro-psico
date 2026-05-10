import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Wallet, CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  category: string;
}

const formSchema = z.object({
  description: z.string().min(2, "Descrição deve ter pelo menos 2 caracteres"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE']),
  category: z.string().min(2, "Categoria é obrigatória"),
});

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomeSheetOpen, setIncomeSheetOpen] = useState(false);
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const incomeForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      status: "PAID",
      category: "APPOINTMENT",
    },
  });

  const expenseForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      status: "PAID",
      category: "OFFICE",
    },
  });

  const fetchTransactions = () => {
    setLoading(true);
    fetch('/api/finance/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  function onSubmitIncome(values: z.infer<typeof formSchema>) {
    fetch('/api/finance/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, type: 'INCOME' }),
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Receita adicionada com sucesso!");
        setIncomeSheetOpen(false);
        incomeForm.reset();
        fetchTransactions();
      })
      .catch(() => {
        toast.error("Erro ao adicionar receita.");
      });
  }

  function onSubmitExpense(values: z.infer<typeof formSchema>) {
    fetch('/api/finance/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, type: 'EXPENSE' }),
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Despesa adicionada com sucesso!");
        setExpenseSheetOpen(false);
        expenseForm.reset();
        fetchTransactions();
      })
      .catch(() => {
        toast.error("Erro ao adicionar despesa.");
      });
  }

  const filteredTransactions = transactions.filter(t => {
    if (activeTab !== 'all' && t.type.toLowerCase() !== activeTab) return false;
    
    if (dateRange?.from) {
      const txDate = new Date(t.date);
      txDate.setHours(0, 0, 0, 0);
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (txDate < fromDate) return false;
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (txDate > toDate) return false;
      }
    }
    return true;
  });

  const totalIncome = filteredTransactions.filter(t => t.type === 'INCOME' && t.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'EXPENSE' && t.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;
  const pendingIncome = filteredTransactions.filter(t => t.type === 'INCOME' && t.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Controle Financeiro</h2>
        <div className="flex space-x-2">
          <Sheet open={expenseSheetOpen} onOpenChange={setExpenseSheetOpen}>
            <SheetTrigger render={<Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" />}>
              <ArrowDownCircle className="w-4 h-4 mr-2" />
              Nova Despesa
            </SheetTrigger>
            <SheetContent className="sm:max-w-[425px]">
              <SheetHeader>
                <SheetTitle>Nova Despesa</SheetTitle>
                <SheetDescription>
                  Registre uma nova despesa (saída).
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <Form {...expenseForm}>
                  <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-4">
                    <FormField
                      control={expenseForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Aluguel, Internet..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PROPERTY">Imóvel/Aluguel</SelectItem>
                              <SelectItem value="OFFICE">Escritório/Suprimentos</SelectItem>
                              <SelectItem value="TAXES">Impostos/Taxas</SelectItem>
                              <SelectItem value="MARKETING">Marketing</SelectItem>
                              <SelectItem value="OTHER">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PAID">Pago</SelectItem>
                              <SelectItem value="PENDING">Pendente</SelectItem>
                              <SelectItem value="OVERDUE">Atrasado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" variant="destructive">Salvar Despesa</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={incomeSheetOpen} onOpenChange={setIncomeSheetOpen}>
            <SheetTrigger render={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground" />}>
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Nova Receita
            </SheetTrigger>
            <SheetContent className="sm:max-w-[425px]">
              <SheetHeader>
                <SheetTitle>Nova Receita</SheetTitle>
                <SheetDescription>
                  Registre uma nova receita (entrada).
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <Form {...incomeForm}>
                  <form onSubmit={incomeForm.handleSubmit(onSubmitIncome)} className="space-y-4">
                    <FormField
                      control={incomeForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Consulta - João Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={incomeForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={incomeForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="APPOINTMENT">Consulta</SelectItem>
                              <SelectItem value="PACKAGE">Pacote de Sessões</SelectItem>
                              <SelectItem value="REPORT">Laudo/Relatório</SelectItem>
                              <SelectItem value="OTHER">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={incomeForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PAID">Pago</SelectItem>
                              <SelectItem value="PENDING">Pendente</SelectItem>
                              <SelectItem value="OVERDUE">Atrasado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Salvar Receita</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo em Caixa</CardTitle>
            <Wallet className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Atualizado hoje</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas (Pagas)</CardTitle>
            <ArrowUpCircle className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Neste mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas (Pagas)</CardTitle>
            <ArrowDownCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpense)}</div>
            <p className="text-xs text-muted-foreground mt-1">Neste mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">A Receber</CardTitle>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{formatCurrency(pendingIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Consultas agendadas/pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Transações Recentes</CardTitle>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger render={
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                />
              }>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd LLL, y", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd LLL, y", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd LLL, y", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
            </TabsList>
            
            <div className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Carregando transações...</TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma transação encontrada no período.</TableCell>
                    </TableRow>
                  ) : filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{format(new Date(t.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell className="font-medium">{t.description}</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          {t.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'PAID' ? 'default' : t.status === 'PENDING' ? 'secondary' : 'destructive'}
                               className={t.status === 'PAID' ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}>
                          {t.status === 'PAID' ? 'Pago' : t.status === 'PENDING' ? 'Pendente' : 'Atrasado'}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${t.type === 'INCOME' ? 'text-primary' : 'text-destructive'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
