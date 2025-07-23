import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  FileText,
  Users,
  Building,
  Car
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, LineChart, Line } from "recharts";

const mockBarData = [
  { name: "Jan", value: 2400 },
  { name: "Fev", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Abr", value: 3908 },
  { name: "Mai", value: 4800 },
  { name: "Jun", value: 3800 }
];

const mockPieData = [
  { name: "Clientes", value: 400, color: "#0088FE" },
  { name: "Funcionários", value: 300, color: "#00C49F" },
  { name: "Estoque", value: 300, color: "#FFBB28" },
  { name: "Frota", value: 200, color: "#FF8042" }
];

const mockLineData = [
  { name: "Jan", requests: 65, completed: 58 },
  { name: "Fev", requests: 78, completed: 72 },
  { name: "Mar", requests: 90, completed: 85 },
  { name: "Abr", requests: 81, completed: 79 },
  { name: "Mai", requests: 95, completed: 89 },
  { name: "Jun", requests: 88, completed: 84 }
];

interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  lastGenerated: string;
  status: "ready" | "generating" | "error";
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Relatório de Clientes",
    type: "clients",
    description: "Lista completa de clientes cadastrados",
    lastGenerated: "2024-01-20",
    status: "ready"
  },
  {
    id: "2",
    name: "Solicitações por Período",
    type: "requests",
    description: "Análise de solicitações de hotéis",
    lastGenerated: "2024-01-19",
    status: "ready"
  },
  {
    id: "3",
    name: "Controle de Estoque",
    type: "inventory",
    description: "Status atual do estoque de uniformes",
    lastGenerated: "2024-01-18",
    status: "generating"
  }
];

export default function Reports() {
  const [reports] = useState<Report[]>(mockReports);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive"> = {
      ready: "default",
      generating: "secondary",
      error: "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios e Dashboards</h1>
            <p className="text-muted-foreground">Análises visuais e exportações</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Análises
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Exportações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Filtros de Período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filtros de Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Label>Período</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Última Semana</SelectItem>
                        <SelectItem value="month">Último Mês</SelectItem>
                        <SelectItem value="quarter">Último Trimestre</SelectItem>
                        <SelectItem value="year">Último Ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Início</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Fim</Label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Solicitações por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribuição por Módulo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip />
                      <RechartsPieChart data={mockPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {mockPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Solicitações vs Concluídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockLineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" name="Solicitações" />
                      <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" name="Concluídas" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Lista de Relatórios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Última geração: {new Date(report.lastGenerated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Baixar
                        </Button>
                        <Button size="sm">Gerar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Relatórios Personalizados */}
            <Card>
              <CardHeader>
                <CardTitle>Criar Relatório Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Relatório</Label>
                      <Input placeholder="Digite o nome do relatório" />
                    </div>
                    <div className="space-y-2">
                      <Label>Módulo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o módulo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clients">Clientes</SelectItem>
                          <SelectItem value="requests">Solicitações</SelectItem>
                          <SelectItem value="employees">Funcionários</SelectItem>
                          <SelectItem value="inventory">Estoque</SelectItem>
                          <SelectItem value="fleet">Frota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button>Criar Relatório</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Comparativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Análise de Funcionários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Funcionários</span>
                      <span className="font-bold">248</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ativos este mês</span>
                      <span className="font-bold text-success">235</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Novos contratados</span>
                      <span className="font-bold text-primary">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Análise de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Clientes</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ativos este mês</span>
                      <span className="font-bold text-success">67</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Novos cadastros</span>
                      <span className="font-bold text-primary">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Análise de Frota
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Veículos</span>
                      <span className="font-bold">34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Em uso</span>
                      <span className="font-bold text-success">28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Manutenção</span>
                      <span className="font-bold text-warning">6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparativo Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Solicitações</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">+15%</span>
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Gastos</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">-8%</span>
                        <TrendingUp className="h-4 w-4 text-success rotate-180" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Eficiência</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">+22%</span>
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <FileText className="h-12 w-12 text-primary mx-auto" />
                          <h3 className="font-semibold">PDF</h3>
                          <p className="text-sm text-muted-foreground">Relatórios formatados</p>
                          <Button size="sm" className="w-full">Exportar PDF</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <BarChart3 className="h-12 w-12 text-success mx-auto" />
                          <h3 className="font-semibold">Excel</h3>
                          <p className="text-sm text-muted-foreground">Planilhas detalhadas</p>
                          <Button size="sm" className="w-full">Exportar Excel</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <Download className="h-12 w-12 text-accent mx-auto" />
                          <h3 className="font-semibold">CSV</h3>
                          <p className="text-sm text-muted-foreground">Dados brutos</p>
                          <Button size="sm" className="w-full">Exportar CSV</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Configurações de Exportação</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Formato de Data</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="DD/MM/AAAA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                            <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                            <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Incluir Logo da Empresa</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sim" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Sim</SelectItem>
                            <SelectItem value="no">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}