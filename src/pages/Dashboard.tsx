import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, TrendingUp, TrendingDown, Activity, Download, Filter } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

// Mock Data for Charts
const revenueData = [
  { name: 'Jan', income: 28000, expense: 12000 },
  { name: 'Fev', income: 32000, expense: 14000 },
  { name: 'Mar', income: 38000, expense: 13500 },
  { name: 'Abr', income: 36000, expense: 15000 },
  { name: 'Mai', income: 45000, expense: 16000 },
  { name: 'Jun', income: 48000, expense: 15500 },
];

const modalityData = [
  { name: 'Online', value: 65 },
  { name: 'Presencial', value: 35 },
];

const statusData = [
  { name: 'Realizadas', value: 78 },
  { name: 'Canceladas', value: 12 },
  { name: 'No-Show', value: 10 },
];

const patientGrowthData = [
  { name: 'Sem 1', ativos: 105, novos: 5 },
  { name: 'Sem 2', ativos: 112, novos: 8 },
  { name: 'Sem 3', ativos: 118, novos: 7 },
  { name: 'Sem 4', ativos: 128, novos: 12 },
];

// Soft Green Theme Colors
const COLORS = ['#5E8C83', '#84A98C', '#CAD2C5', '#354F52', '#2F3E46'];
const PIE_COLORS = ['#5E8C83', '#CAD2C5'];
const STATUS_COLORS = ['#5E8C83', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const [period, setPeriod] = useState('6m');

  return (
    <div className="space-y-4">
      {/* Top Control Bar - Power BI Style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-4 rounded-lg border border-border shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Visão Executiva</h2>
          <p className="text-xs text-muted-foreground">Última atualização: Hoje, 08:45</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-muted/50 rounded-md p-1 border border-border">
            <Filter className="w-4 h-4 text-muted-foreground mx-2" />
            <Select defaultValue="all_clinics">
              <SelectTrigger className="w-[140px] h-8 border-0 bg-transparent shadow-none focus:ring-0 text-xs font-medium">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_clinics">Todas Unidades</SelectItem>
                <SelectItem value="matriz">Matriz (SP)</SelectItem>
                <SelectItem value="filial1">Filial (RJ)</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px h-4 bg-border mx-1"></div>
            <Select defaultValue="all_profs">
              <SelectTrigger className="w-[140px] h-8 border-0 bg-transparent shadow-none focus:ring-0 text-xs font-medium">
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_profs">Todos Profissionais</SelectItem>
                <SelectItem value="dr_admin">Dr. Admin</SelectItem>
                <SelectItem value="dra_ana">Dra. Ana</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px h-4 bg-border mx-1"></div>
            <Select defaultValue={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[120px] h-8 border-0 bg-transparent shadow-none focus:ring-0 text-xs font-medium">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="ytd">Este ano (YTD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="h-10">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Receita Bruta</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">R$ 48.000</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-primary flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
              </span>
              <span className="text-muted-foreground ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticket Médio</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">R$ 185</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-primary flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.1%
              </span>
              <span className="text-muted-foreground ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pacientes Ativos</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">128</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-primary flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> +12 novos
              </span>
              <span className="text-muted-foreground ml-2">neste mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ocupação</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">85%</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-primary flex items-center font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> +5%
              </span>
              <span className="text-muted-foreground ml-2">vs. média anual</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Taxa No-Show</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">4.2%</h3>
              </div>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-primary flex items-center font-medium">
                <TrendingDown className="w-3 h-3 mr-1" /> -1.5%
              </span>
              <span className="text-muted-foreground ml-2">melhora vs. mês ant.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Fluxo de Caixa (Receitas vs Despesas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5E8C83" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5E8C83" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `R$${value/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, undefined]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" name="Receitas" dataKey="income" stroke="#5E8C83" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" name="Despesas" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Modalidade de Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modalityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value}%`, undefined]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-2 grid grid-cols-2 gap-4 text-center">
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Online</p>
                <p className="text-lg font-bold text-primary">65%</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Presencial</p>
                <p className="text-lg font-bold text-muted-foreground">35%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Status das Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={80} />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Crescimento da Base de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patientGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" name="Total Ativos" dataKey="ativos" stroke="#5E8C83" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" name="Novos (Semana)" dataKey="novos" stroke="#84A98C" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
