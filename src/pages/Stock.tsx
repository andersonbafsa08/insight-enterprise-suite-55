import { useState } from "react";
import { 
  Plus, 
  Search, 
  Package, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  History,
  Edit,
  Trash,
  Eye,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Interfaces
interface StockItem {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima: number;
  valor: number;
  localizacao: string;
  ultimaMovimentacao: string;
}

interface MovimentacaoEstoque {
  id: string;
  estoqueId: string;
  colaboradorId: string;
  colaboradorNome: string;
  tipoMovimentacao: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  observacoes?: string;
  statusRecibo: 'pendente' | 'processado';
  nomeItem: string;
  codigoItem: string;
}

interface Employee {
  id: string;
  nome: string;
  cargo: string;
  filial: string;
}

// Mock Data
const mockEmployees: Employee[] = [
  { id: "1", nome: "João Silva", cargo: "Técnico", filial: "Matriz" },
  { id: "2", nome: "Maria Santos", cargo: "Analista", filial: "Filial 1" },
  { id: "3", nome: "Pedro Costa", cargo: "Operador", filial: "Matriz" },
];

const mockStock: StockItem[] = [
  {
    id: "1",
    codigo: "UNI-001",
    nome: "Camisa Polo - M",
    categoria: "Uniformes",
    quantidadeAtual: 15,
    quantidadeMinima: 5,
    quantidadeMaxima: 50,
    valor: 45.00,
    localizacao: "Almoxarifado A - Prateleira 1",
    ultimaMovimentacao: "2024-03-01"
  },
  {
    id: "2",
    codigo: "EPI-001",
    nome: "Capacete de Segurança",
    categoria: "EPIs",
    quantidadeAtual: 3,
    quantidadeMinima: 8,
    quantidadeMaxima: 30,
    valor: 85.00,
    localizacao: "Almoxarifado B - Prateleira 1",
    ultimaMovimentacao: "2024-02-28"
  },
  {
    id: "3",
    codigo: "UNI-002",
    nome: "Calça Jeans - 42",
    categoria: "Uniformes",
    quantidadeAtual: 22,
    quantidadeMinima: 10,
    quantidadeMaxima: 40,
    valor: 65.00,
    localizacao: "Almoxarifado A - Prateleira 2",
    ultimaMovimentacao: "2024-03-05"
  },
  {
    id: "4",
    codigo: "EPI-002",
    nome: "Luvas de Segurança",
    categoria: "EPIs",
    quantidadeAtual: 8,
    quantidadeMinima: 15,
    quantidadeMaxima: 50,
    valor: 12.00,
    localizacao: "Almoxarifado B - Prateleira 2",
    ultimaMovimentacao: "2024-03-03"
  }
];

const mockMovimentacoes: MovimentacaoEstoque[] = [
  {
    id: "1",
    estoqueId: "1",
    colaboradorId: "1",
    colaboradorNome: "João Silva",
    tipoMovimentacao: "saida",
    quantidade: 2,
    data: "2024-03-01T10:30:00Z",
    observacoes: "Entrega de uniformes novos",
    statusRecibo: "processado",
    nomeItem: "Camisa Polo - M",
    codigoItem: "UNI-001"
  },
  {
    id: "2",
    estoqueId: "2",
    colaboradorId: "2",
    colaboradorNome: "Maria Santos",
    tipoMovimentacao: "saida",
    quantidade: 1,
    data: "2024-02-28T14:15:00Z",
    observacoes: "Substituição de EPI danificado",
    statusRecibo: "pendente",
    nomeItem: "Capacete de Segurança",
    codigoItem: "EPI-001"
  },
];

const categorias = ["Uniformes", "EPIs", "Acessórios", "Calçados"];

export default function Stock() {
  const [stock, setStock] = useState<StockItem[]>(mockStock);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>(mockMovimentacoes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMovimentacaoDialogOpen, setIsMovimentacaoDialogOpen] = useState(false);
  const [isHistoricoDialogOpen, setIsHistoricoDialogOpen] = useState(false);
  
  // Form states
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [movimentacaoForm, setMovimentacaoForm] = useState({
    tipo: 'entrada' as 'entrada' | 'saida',
    quantidade: '',
    colaboradorId: '',
    observacoes: ''
  });

  // New item form
  const [newItemForm, setNewItemForm] = useState({
    codigo: '',
    nome: '',
    categoria: '',
    quantidadeAtual: '',
    quantidadeMinima: '',
    quantidadeMaxima: '',
    valor: '',
    localizacao: ''
  });

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: StockItem) => {
    if (item.quantidadeAtual <= item.quantidadeMinima) {
      return { status: "low", label: "Estoque Baixo", variant: "destructive" as const };
    } else if (item.quantidadeAtual >= item.quantidadeMaxima * 0.8) {
      return { status: "high", label: "Estoque Alto", variant: "default" as const };
    } else {
      return { status: "normal", label: "Normal", variant: "secondary" as const };
    }
  };

  const handleAddItem = () => {
    if (!newItemForm.codigo || !newItemForm.nome || !newItemForm.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newItem: StockItem = {
      id: Date.now().toString(),
      codigo: newItemForm.codigo,
      nome: newItemForm.nome,
      categoria: newItemForm.categoria,
      quantidadeAtual: parseInt(newItemForm.quantidadeAtual) || 0,
      quantidadeMinima: parseInt(newItemForm.quantidadeMinima) || 0,
      quantidadeMaxima: parseInt(newItemForm.quantidadeMaxima) || 0,
      valor: parseFloat(newItemForm.valor) || 0,
      localizacao: newItemForm.localizacao,
      ultimaMovimentacao: new Date().toISOString().split('T')[0]
    };

    setStock([...stock, newItem]);
    setNewItemForm({
      codigo: '', nome: '', categoria: '', quantidadeAtual: '', 
      quantidadeMinima: '', quantidadeMaxima: '', valor: '', localizacao: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item adicionado",
      description: `${newItem.nome} foi adicionado ao estoque`,
    });
  };

  const handleMovimentacao = () => {
    if (!selectedItem || !movimentacaoForm.quantidade || !movimentacaoForm.colaboradorId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const quantidade = parseInt(movimentacaoForm.quantidade);
    
    // Validação para saída
    if (movimentacaoForm.tipo === 'saida' && quantidade > selectedItem.quantidadeAtual) {
      toast({
        title: "Erro",
        description: "Quantidade de saída maior que o estoque disponível",
        variant: "destructive",
      });
      return;
    }

    const colaborador = mockEmployees.find(emp => emp.id === movimentacaoForm.colaboradorId);
    
    const novaMovimentacao: MovimentacaoEstoque = {
      id: Date.now().toString(),
      estoqueId: selectedItem.id,
      colaboradorId: movimentacaoForm.colaboradorId,
      colaboradorNome: colaborador?.nome || '',
      tipoMovimentacao: movimentacaoForm.tipo,
      quantidade: quantidade,
      data: new Date().toISOString(),
      observacoes: movimentacaoForm.observacoes,
      statusRecibo: 'pendente',
      nomeItem: selectedItem.nome,
      codigoItem: selectedItem.codigo
    };

    // Atualizar estoque
    const novaQuantidade = movimentacaoForm.tipo === 'entrada' 
      ? selectedItem.quantidadeAtual + quantidade
      : selectedItem.quantidadeAtual - quantidade;

    setStock(stock.map(item => 
      item.id === selectedItem.id 
        ? { ...item, quantidadeAtual: novaQuantidade, ultimaMovimentacao: new Date().toISOString().split('T')[0] }
        : item
    ));

    setMovimentacoes([...movimentacoes, novaMovimentacao]);
    
    setMovimentacaoForm({ tipo: 'entrada', quantidade: '', colaboradorId: '', observacoes: '' });
    setSelectedItem(null);
    setIsMovimentacaoDialogOpen(false);
    
    toast({
      title: "Movimentação registrada",
      description: `${movimentacaoForm.tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${quantidade} unidades registrada`,
    });
  };

  const openMovimentacaoDialog = (item: StockItem, tipo: 'entrada' | 'saida') => {
    setSelectedItem(item);
    setMovimentacaoForm({ ...movimentacaoForm, tipo });
    setIsMovimentacaoDialogOpen(true);
  };

  const getMovimentacoesByItem = (itemId: string) => {
    return movimentacoes.filter(mov => mov.estoqueId === itemId);
  };

  const getMovimentacoesByColaborador = () => {
    const grouped: { [key: string]: MovimentacaoEstoque[] } = {};
    movimentacoes.forEach(mov => {
      if (!grouped[mov.colaboradorNome]) {
        grouped[mov.colaboradorNome] = [];
      }
      grouped[mov.colaboradorNome].push(mov);
    });
    return grouped;
  };

  const generateRecibo = (colaboradorNome: string) => {
    toast({
      title: "Recibo gerado",
      description: `Recibo de entrega para ${colaboradorNome} foi gerado em PDF`,
    });
  };

  const exportRelatorio = () => {
    toast({
      title: "Relatório exportado",
      description: "Relatório de estoque foi exportado para Excel",
    });
  };

  const lowStockItems = stock.filter(item => item.quantidadeAtual <= item.quantidadeMinima);
  const totalValue = stock.reduce((acc, item) => acc + (item.quantidadeAtual * item.valor), 0);
  const totalItems = stock.reduce((acc, item) => acc + item.quantidadeAtual, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerenciamento de uniformes e EPIs com rastreabilidade</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportRelatorio} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Item de Estoque</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código *</Label>
                    <Input 
                      id="codigo" 
                      placeholder="Ex: UNI-001" 
                      value={newItemForm.codigo}
                      onChange={(e) => setNewItemForm({...newItemForm, codigo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={newItemForm.categoria} onValueChange={(value) => setNewItemForm({...newItemForm, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(categoria => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Item *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Digite o nome do item..." 
                    value={newItemForm.nome}
                    onChange={(e) => setNewItemForm({...newItemForm, nome: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidadeAtual">Quantidade Atual</Label>
                    <Input 
                      id="quantidadeAtual" 
                      type="number" 
                      placeholder="0" 
                      value={newItemForm.quantidadeAtual}
                      onChange={(e) => setNewItemForm({...newItemForm, quantidadeAtual: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantidadeMinima">Quantidade Mínima</Label>
                    <Input 
                      id="quantidadeMinima" 
                      type="number" 
                      placeholder="0" 
                      value={newItemForm.quantidadeMinima}
                      onChange={(e) => setNewItemForm({...newItemForm, quantidadeMinima: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantidadeMaxima">Quantidade Máxima</Label>
                    <Input 
                      id="quantidadeMaxima" 
                      type="number" 
                      placeholder="0" 
                      value={newItemForm.quantidadeMaxima}
                      onChange={(e) => setNewItemForm({...newItemForm, quantidadeMaxima: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor Unitário (R$)</Label>
                    <Input 
                      id="valor" 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      value={newItemForm.valor}
                      onChange={(e) => setNewItemForm({...newItemForm, valor: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input 
                      id="localizacao" 
                      placeholder="Ex: Almoxarifado A - Prateleira 1" 
                      value={newItemForm.localizacao}
                      onChange={(e) => setNewItemForm({...newItemForm, localizacao: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddItem}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Itens com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-background rounded">
                  <div>
                    <span className="font-medium">{item.nome}</span>
                    <span className="text-muted-foreground ml-2">({item.codigo})</span>
                  </div>
                  <Badge variant="destructive">
                    {item.quantidadeAtual} / {item.quantidadeMinima} mín.
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="estoque" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estoque">Controle de Estoque</TabsTrigger>
          <TabsTrigger value="historico" onClick={() => setIsHistoricoDialogOpen(true)}>
            Histórico por Colaborador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estoque" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const itemMovimentacoes = getMovimentacoesByItem(item.id);
                    
                    return (
                      <Collapsible key={item.id} asChild>
                        <>
                          <TableRow>
                            <TableCell className="font-medium">{item.codigo}</TableCell>
                            <TableCell>{item.nome}</TableCell>
                            <TableCell>{item.categoria}</TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-medium">{item.quantidadeAtual}</div>
                                <div className="text-xs text-muted-foreground">
                                  Min: {item.quantidadeMinima} | Max: {item.quantidadeMaxima}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.quantidadeAtual <= item.quantidadeMinima && (
                                  <TrendingDown className="h-4 w-4 text-destructive" />
                                )}
                                {item.quantidadeAtual >= item.quantidadeMaxima * 0.8 && (
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                )}
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      stockStatus.status === 'low' ? 'bg-destructive' :
                                      stockStatus.status === 'high' ? 'bg-primary' : 'bg-secondary'
                                    }`}
                                    style={{
                                      width: `${Math.min((item.quantidadeAtual / item.quantidadeMaxima) * 100, 100)}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>R$ {item.valor.toFixed(2)}</TableCell>
                            <TableCell className="text-sm">{item.localizacao}</TableCell>
                            <TableCell>
                              <Badge variant={stockStatus.variant}>
                                {stockStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openMovimentacaoDialog(item, 'entrada')}
                                  className="h-8 w-8 p-0"
                                >
                                  <ArrowDownToLine className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openMovimentacaoDialog(item, 'saida')}
                                  className="h-8 w-8 p-0"
                                  disabled={item.quantidadeAtual === 0}
                                >
                                  <ArrowUpFromLine className="h-3 w-3" />
                                </Button>
                                <CollapsibleTrigger asChild>
                                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                    <History className="h-3 w-3" />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={9} className="p-4 bg-muted/50">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Histórico de Movimentações</h4>
                                  {itemMovimentacoes.length > 0 ? (
                                    <div className="space-y-1">
                                      {itemMovimentacoes.map(mov => (
                                        <div key={mov.id} className="flex justify-between items-center p-2 bg-background rounded text-sm">
                                          <div className="flex items-center gap-2">
                                            {mov.tipoMovimentacao === 'entrada' ? (
                                              <ArrowDownToLine className="h-3 w-3 text-green-600" />
                                            ) : (
                                              <ArrowUpFromLine className="h-3 w-3 text-red-600" />
                                            )}
                                            <span className="capitalize">{mov.tipoMovimentacao}</span>
                                            <span>- {mov.quantidade} unidades</span>
                                            <span>- {mov.colaboradorNome}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span>{new Date(mov.data).toLocaleDateString()}</span>
                                            <Badge variant={mov.statusRecibo === 'processado' ? 'default' : 'secondary'}>
                                              {mov.statusRecibo}
                                            </Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredStock.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum item encontrado</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Movimentação Dialog */}
      <Dialog open={isMovimentacaoDialogOpen} onOpenChange={setIsMovimentacaoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {movimentacaoForm.tipo === 'entrada' ? 'Entrada' : 'Saída'} de Estoque
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded">
                <div className="font-semibold">{selectedItem.nome}</div>
                <div className="text-sm text-muted-foreground">
                  Código: {selectedItem.codigo} | Estoque atual: {selectedItem.quantidadeAtual}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="Digite a quantidade"
                  value={movimentacaoForm.quantidade}
                  onChange={(e) => setMovimentacaoForm({...movimentacaoForm, quantidade: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colaborador">Colaborador *</Label>
                <Select 
                  value={movimentacaoForm.colaboradorId} 
                  onValueChange={(value) => setMovimentacaoForm({...movimentacaoForm, colaboradorId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nome} - {emp.cargo} ({emp.filial})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Digite observações sobre a movimentação..."
                  value={movimentacaoForm.observacoes}
                  onChange={(e) => setMovimentacaoForm({...movimentacaoForm, observacoes: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMovimentacaoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMovimentacao}>
              Confirmar {movimentacaoForm.tipo === 'entrada' ? 'Entrada' : 'Saída'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Histórico por Colaborador Dialog */}
      <Dialog open={isHistoricoDialogOpen} onOpenChange={setIsHistoricoDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Histórico por Colaborador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {Object.entries(getMovimentacoesByColaborador()).map(([colaborador, movs]) => (
              <Card key={colaborador}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{colaborador}</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => generateRecibo(colaborador)}
                      className="gap-2"
                    >
                      <FileText className="h-3 w-3" />
                      Gerar Recibo PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {movs.map(mov => (
                      <div key={mov.id} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                        <div className="flex items-center gap-2">
                          {mov.tipoMovimentacao === 'entrada' ? (
                            <ArrowDownToLine className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowUpFromLine className="h-3 w-3 text-red-600" />
                          )}
                          <span>{mov.nomeItem} ({mov.codigoItem})</span>
                          <span>- {mov.quantidade} unidades</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{new Date(mov.data).toLocaleDateString()}</span>
                          <Badge variant={mov.statusRecibo === 'processado' ? 'default' : 'secondary'}>
                            {mov.statusRecibo}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoricoDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}