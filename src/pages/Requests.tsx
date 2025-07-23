import { useState } from "react";
import { Plus, Search, Filter, Download, MoreHorizontal, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  numeroSolicitacao: string;
  cliente: string;
  hotel: string;
  numeroPessoas: number;
  diarias: number;
  valorUnitario: number;
  valorTotal: number;
  status: 'pendente' | 'completo';
  dataInicio: string;
  dataFim: string;
  observacoes?: string;
}

const mockRequests: Request[] = [
  {
    id: "1",
    numeroSolicitacao: "SOL-2024-001",
    cliente: "Hotel Central Plaza",
    hotel: "Plaza Executive",
    numeroPessoas: 2,
    diarias: 3,
    valorUnitario: 180.00,
    valorTotal: 1080.00,
    status: 'pendente',
    dataInicio: "2024-03-01",
    dataFim: "2024-03-04",
    observacoes: "Quarto duplo com café da manhã"
  },
  {
    id: "2",
    numeroSolicitacao: "SOL-2024-002",
    cliente: "Pousada Vista Alegre",
    hotel: "Vista Copacabana",
    numeroPessoas: 1,
    diarias: 5,
    valorUnitario: 220.00,
    valorTotal: 1100.00,
    status: 'completo',
    dataInicio: "2024-02-15",
    dataFim: "2024-02-20",
    observacoes: "Vista para o mar"
  }
];

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [activeRequests, setActiveRequests] = useState<Request[]>(
    mockRequests.filter(r => r.status === 'pendente')
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const filteredActiveRequests = activeRequests.filter(request =>
    request.numeroSolicitacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.hotel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistoryRequests = requests.filter(request => {
    const matchesSearch = request.numeroSolicitacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.hotel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCompleteRequest = (requestId: string) => {
    setActiveRequests(prev => prev.filter(r => r.id !== requestId));
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'completo' as const } : r
    ));
    toast({
      title: "Solicitação finalizada",
      description: "A solicitação foi movida para o histórico.",
    });
  };

  const handleReturnToActive = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setActiveRequests(prev => [...prev, { ...request, status: 'pendente' }]);
      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'pendente' as const } : r
      ));
      toast({
        title: "Solicitação reativada",
        description: "A solicitação foi retornada para a lista ativa.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Solicitações de Hotéis</h1>
          <p className="text-muted-foreground">Controle de fluxo de solicitações e pagamentos</p>
        </div>
        
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Solicitação de Hotel</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Hotel Central Plaza</SelectItem>
                      <SelectItem value="2">Pousada Vista Alegre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel">Hotel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h1">Plaza Executive</SelectItem>
                      <SelectItem value="h2">Vista Copacabana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pessoas">Número de Pessoas</Label>
                  <Input id="pessoas" type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diarias">Diárias</Label>
                  <Input id="diarias" type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Unitário</Label>
                  <Input id="valor" type="number" placeholder="0.00" step="0.01" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input id="dataInicio" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Input id="dataFim" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input id="observacoes" placeholder="Observações adicionais..." />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor Total: R$ 0,00</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsNewRequestOpen(false)}>
                Criar Solicitação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Ativas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pessoas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeRequests.reduce((acc, req) => acc + req.numeroPessoas, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Ativo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {activeRequests.reduce((acc, req) => acc + req.valorTotal, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Solicitações Ativas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar solicitações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Active Requests Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Diárias</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActiveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.numeroSolicitacao}</TableCell>
                      <TableCell>{request.cliente}</TableCell>
                      <TableCell>{request.hotel}</TableCell>
                      <TableCell>{request.numeroPessoas}</TableCell>
                      <TableCell>{request.diarias}</TableCell>
                      <TableCell>R$ {request.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(request.dataInicio).toLocaleDateString('pt-BR')} - {' '}
                        {new Date(request.dataFim).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'pendente' ? 'destructive' : 'default'}>
                          {request.status === 'pendente' ? 'Pendente' : 'Completo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Gerenciar Anexos</DropdownMenuItem>
                            <DropdownMenuItem>Gerenciar NF</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCompleteRequest(request.id)}>
                              Finalizar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar no histórico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="completo">Completo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>

          {/* History Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Diárias</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistoryRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.numeroSolicitacao}</TableCell>
                      <TableCell>{request.cliente}</TableCell>
                      <TableCell>{request.hotel}</TableCell>
                      <TableCell>{request.numeroPessoas}</TableCell>
                      <TableCell>{request.diarias}</TableCell>
                      <TableCell>R$ {request.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(request.dataInicio).toLocaleDateString('pt-BR')} - {' '}
                        {new Date(request.dataFim).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'pendente' ? 'destructive' : 'default'}>
                          {request.status === 'pendente' ? 'Pendente' : 'Completo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {request.status === 'completo' && (
                              <DropdownMenuItem onClick={() => handleReturnToActive(request.id)}>
                                Retornar ao Ativo
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}