import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, DollarSign, Plus, Filter, Edit, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Allowance {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  destination: string;
  dailyRate: number;
  nightRate: number;
  totalAmount: number;
  status: "pendente" | "aprovada" | "rejeitada";
  createdAt: string;
}

const mockAllowances: Allowance[] = [
  {
    id: "1",
    employeeId: "emp1",
    employeeName: "João Silva",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    startTime: "08:00",
    endTime: "18:00",
    destination: "São Paulo - SP",
    dailyRate: 120,
    nightRate: 80,
    totalAmount: 480,
    status: "pendente",
    createdAt: "2024-01-10"
  },
  {
    id: "2",
    employeeId: "emp2",
    employeeName: "Maria Santos",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    startTime: "07:00",
    endTime: "19:00",
    destination: "Rio de Janeiro - RJ",
    dailyRate: 150,
    nightRate: 100,
    totalAmount: 600,
    status: "aprovada",
    createdAt: "2024-01-12"
  }
];

export default function Allowances() {
  const [allowances, setAllowances] = useState<Allowance[]>(mockAllowances);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAllowances = allowances.filter(allowance => {
    const matchesSearch = allowance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         allowance.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || allowance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive"> = {
      pendente: "secondary",
      aprovada: "default",
      rejeitada: "destructive"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Controle de Diárias</h1>
            <p className="text-muted-foreground">Gerencie diárias e pernoites dos colaboradores</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Diárias
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Solicitação de Diárias</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Colaborador</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">João Silva</SelectItem>
                      <SelectItem value="emp2">Maria Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Destino</Label>
                  <Input placeholder="Cidade - Estado" />
                </div>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Horário Início</Label>
                  <Input type="time" />
                </div>
                <div className="space-y-2">
                  <Label>Horário Fim</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por colaborador ou destino..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {allowances.filter(a => a.status === "pendente").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {allowances.filter(a => a.status === "aprovada").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejeitadas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {allowances.filter(a => a.status === "rejeitada").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {allowances.reduce((sum, a) => sum + a.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Diárias */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Diárias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor Diária</TableHead>
                  <TableHead>Valor Pernoite</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllowances.map((allowance) => (
                  <TableRow key={allowance.id}>
                    <TableCell className="font-medium">{allowance.employeeName}</TableCell>
                    <TableCell>{allowance.destination}</TableCell>
                    <TableCell>
                      {new Date(allowance.startDate).toLocaleDateString()} - {new Date(allowance.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>R$ {allowance.dailyRate.toLocaleString()}</TableCell>
                    <TableCell>R$ {allowance.nightRate.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">R$ {allowance.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(allowance.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}