import { useState } from "react";
import { Plus, Search, Download, MoreHorizontal, Calendar, Users, DollarSign } from "lucide-react";
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
import { useSolicitacoes } from "@/hooks/useSolicitacoes";

// Interface já definida no hook useSolicitacoes

export default function Requests() {
  const { 
    solicitacoes, 
    isLoading, 
    createSolicitacao, 
    updateSolicitacao, 
    deleteSolicitacao,
    getSolicitacoesPorStatus 
  } = useSolicitacoes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newSolicitacao, setNewSolicitacao] = useState({
    tipo: "Hotel",
    titulo: "",
    descricao: "",
    prioridade: "Média" as const,
    status: "Pendente" as const,
    data_necessidade: "",
    observacoes: ""
  });
  const { toast } = useToast();

  const activeSolicitacoes = getSolicitacoesPorStatus("Pendente");
  const allSolicitacoes = solicitacoes;

  const filteredActiveSolicitacoes = activeSolicitacoes.filter(solicitacao =>
    solicitacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitacao.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solicitacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistorySolicitacoes = allSolicitacoes.filter(solicitacao => {
    const matchesSearch = solicitacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitacao.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitacao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || solicitacao.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCompleteRequest = async (requestId: string) => {
    await updateSolicitacao(requestId, { status: "Aprovada" });
  };

  const handleReturnToActive = async (requestId: string) => {
    await updateSolicitacao(requestId, { status: "Pendente" });
  };

  const handleCreateSolicitacao = async () => {
    const result = await createSolicitacao(newSolicitacao);
    if (result.data) {
      setIsNewRequestOpen(false);
      setNewSolicitacao({
        tipo: "Hotel",
        titulo: "",
        descricao: "",
        prioridade: "Média",
        status: "Pendente",
        data_necessidade: "",
        observacoes: ""
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Solicitações</h1>
          <p className="text-muted-foreground">Controle de fluxo de solicitações gerais</p>
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
                <DialogTitle>Nova Solicitação</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={newSolicitacao.tipo} onValueChange={(value) => setNewSolicitacao({...newSolicitacao, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Transporte">Transporte</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Serviço">Serviço</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select value={newSolicitacao.prioridade} onValueChange={(value) => setNewSolicitacao({...newSolicitacao, prioridade: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input 
                    id="titulo" 
                    value={newSolicitacao.titulo}
                    onChange={(e) => setNewSolicitacao({...newSolicitacao, titulo: e.target.value})}
                    placeholder="Título da solicitação..." 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input 
                    id="descricao" 
                    value={newSolicitacao.descricao}
                    onChange={(e) => setNewSolicitacao({...newSolicitacao, descricao: e.target.value})}
                    placeholder="Descrição detalhada..." 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_necessidade">Data Necessária</Label>
                  <Input 
                    id="data_necessidade" 
                    type="date"
                    value={newSolicitacao.data_necessidade}
                    onChange={(e) => setNewSolicitacao({...newSolicitacao, data_necessidade: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input 
                    id="observacoes" 
                    value={newSolicitacao.observacoes}
                    onChange={(e) => setNewSolicitacao({...newSolicitacao, observacoes: e.target.value})}
                    placeholder="Observações adicionais..." 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateSolicitacao} disabled={isLoading}>
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
            <div className="text-2xl font-bold">{activeSolicitacoes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getSolicitacoesPorStatus("Aprovada").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allSolicitacoes.length}
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
                  {filteredActiveSolicitacoes.map((solicitacao) => (
                    <TableRow key={solicitacao.id}>
                      <TableCell className="font-medium">{solicitacao.id.slice(0, 8)}</TableCell>
                      <TableCell>{solicitacao.tipo}</TableCell>
                      <TableCell>{solicitacao.titulo}</TableCell>
                      <TableCell>{solicitacao.prioridade}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {solicitacao.data_necessidade ? new Date(solicitacao.data_necessidade).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={solicitacao.status === 'Pendente' ? 'destructive' : 'default'}>
                          {solicitacao.status}
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
                            <DropdownMenuItem onClick={() => handleCompleteRequest(solicitacao.id)}>
                              Aprovar
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
                  {filteredHistorySolicitacoes.map((solicitacao) => (
                    <TableRow key={solicitacao.id}>
                      <TableCell className="font-medium">{solicitacao.id.slice(0, 8)}</TableCell>
                      <TableCell>{solicitacao.tipo}</TableCell>
                      <TableCell>{solicitacao.titulo}</TableCell>
                      <TableCell>{solicitacao.prioridade}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {solicitacao.data_necessidade ? new Date(solicitacao.data_necessidade).toLocaleDateString('pt-BR') : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={solicitacao.status === 'Pendente' ? 'destructive' : 'default'}>
                          {solicitacao.status}
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
                            {solicitacao.status === 'Aprovada' && (
                              <DropdownMenuItem onClick={() => handleReturnToActive(solicitacao.id)}>
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