import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Plus, 
  Filter, 
  Search, 
  FileText, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  createAjudaCustoSchema, 
  updateAjudaCustoSchema,
  type AjudaCusto,
  type CreateAjudaCusto,
  type UpdateAjudaCusto
} from "@/types/schemas";
import { format } from "date-fns";

export default function Allowances() {
  const [ajudas, setAjudas] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<Array<{id: string, nome: string}>>([]);
  const [clientes, setClientes] = useState<Array<{id: string, nome: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAjuda, setEditingAjuda] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  // Permissões
  const canCreate = hasPermission('ajudas_custo', 'write');
  const canUpdate = hasPermission('ajudas_custo', 'write');
  const canDelete = hasPermission('ajudas_custo', 'delete');
  const canApprove = hasPermission('ajudas_custo', 'approve');

  // Form para criar/editar ajuda de custo
  const form = useForm<any>({
    resolver: zodResolver(createAjudaCustoSchema),
    defaultValues: {
      tipo: '',
      descricao: '',
      valor: 0,
      data_gasto: '',
      status: 'Pendente'
    }
  });

  // Carregar dados
  useEffect(() => {
    Promise.all([
      fetchAjudas(),
      fetchColaboradores(),
      fetchClientes()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchAjudas = async () => {
    try {
      const { data, error } = await supabase
        .from('ajudas_custo')
        .select(`
          *,
          colaborador:colaboradores(nome),
          cliente:clientes(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAjudas(data || []);
    } catch (error) {
      console.error('Erro ao carregar ajudas de custo:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar ajudas de custo.",
        variant: "destructive",
      });
    }
  };

  const fetchColaboradores = async () => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('id, nome')
        .eq('status', 'Ativo')
        .order('nome');

      if (error) throw error;
      setColaboradores(data || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('status', 'Ativo')
        .order('nome');

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingAjuda) {
        // Atualizar - remover campos não necessários
        const { status, ...updateData } = data;
        const { error } = await supabase
          .from('ajudas_custo')
          .update(updateData)
          .eq('id', editingAjuda.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Ajuda de custo atualizada com sucesso.",
        });
      } else {
        // Criar
        const { error } = await supabase
          .from('ajudas_custo')
          .insert(data);

        if (error) throw error;

        toast({
          title: "Sucesso", 
          description: "Ajuda de custo criada com sucesso.",
        });
      }

      setDialogOpen(false);
      setEditingAjuda(null);
      form.reset();
      fetchAjudas();
    } catch (error) {
      console.error('Erro ao salvar ajuda de custo:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar ajuda de custo.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ajuda: any) => {
    setEditingAjuda(ajuda);
    form.reset({
      tipo: ajuda.tipo,
      descricao: ajuda.descricao,
      valor: ajuda.valor,
      data_gasto: ajuda.data_gasto,
      colaborador_id: ajuda.colaborador_id || undefined,
      cliente_id: ajuda.cliente_id || undefined,
      observacoes: ajuda.observacoes || undefined,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ajuda de custo?')) return;

    try {
      const { error } = await supabase
        .from('ajudas_custo')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ajuda de custo excluída com sucesso.",
      });

      fetchAjudas();
    } catch (error) {
      console.error('Erro ao excluir ajuda de custo:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir ajuda de custo.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'Aprovada' | 'Rejeitada') => {
    try {
      const updateData = {
        status,
        data_aprovacao: status === 'Aprovada' ? new Date().toISOString() : undefined
      };

      const { error } = await supabase
        .from('ajudas_custo')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Ajuda de custo ${status.toLowerCase()} com sucesso.`,
      });

      fetchAjudas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar status.",
        variant: "destructive",
      });
    }
  };

  // Filtrar ajudas de custo
  const filteredAjudas = ajudas.filter(ajuda => {
    const matchesStatus = statusFilter === 'all' || ajuda.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      ajuda.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ajuda.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calcular estatísticas
  const totalValue = filteredAjudas.reduce((sum, ajuda) => sum + ajuda.valor, 0);
  const pendingCount = filteredAjudas.filter(a => a.status === 'Pendente').length;
  const approvedCount = filteredAjudas.filter(a => a.status === 'Aprovada').length;

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pendente': 'secondary',
      'Aprovada': 'default',
      'Rejeitada': 'destructive',
      'Paga': 'outline'
    } as const;

    const icons = {
      'Pendente': <Clock className="w-3 h-3" />,
      'Aprovada': <CheckCircle className="w-3 h-3" />,
      'Rejeitada': <XCircle className="w-3 h-3" />,
      'Paga': <DollarSign className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className="gap-1">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando ajudas de custo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ajudas de Custo</h1>
          <p className="text-muted-foreground">
            Gerencie as ajudas de custo dos colaboradores
          </p>
        </div>

        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAjuda(null);
                form.reset();
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Ajuda de Custo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAjuda ? 'Editar' : 'Nova'} Ajuda de Custo
                </DialogTitle>
                <DialogDescription>
                  {editingAjuda ? 'Atualize os dados' : 'Preencha os dados'} da ajuda de custo.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Transporte">Transporte</SelectItem>
                              <SelectItem value="Alimentação">Alimentação</SelectItem>
                              <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                              <SelectItem value="Material">Material</SelectItem>
                              <SelectItem value="Combustível">Combustível</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0,00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o motivo da ajuda de custo..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="data_gasto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do Gasto</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="colaborador_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Colaborador</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o colaborador" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colaboradores.map((colaborador) => (
                                <SelectItem key={colaborador.id} value={colaborador.id}>
                                  {colaborador.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cliente_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente (Opcional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientes.map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações adicionais..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingAjuda ? 'Atualizar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Itens</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAjudas.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="Paga">Paga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ajudas de Custo</CardTitle>
          <CardDescription>
            Lista de todas as ajudas de custo registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAjudas.map((ajuda) => (
                <TableRow key={ajuda.id}>
                  <TableCell className="font-medium">{ajuda.tipo}</TableCell>
                  <TableCell>{ajuda.descricao}</TableCell>
                  <TableCell>R$ {ajuda.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    {format(new Date(ajuda.data_gasto), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {(ajuda as any).colaborador?.nome || 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(ajuda.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canUpdate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ajuda)}
                        >
                          Editar
                        </Button>
                      )}
                      
                      {canApprove && ajuda.status === 'Pendente' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleStatusChange(ajuda.id!, 'Aprovada')}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(ajuda.id!, 'Rejeitada')}
                          >
                            Rejeitar
                          </Button>
                        </>
                      )}

                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ajuda.id!)}
                        >
                          Excluir
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAjudas.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma ajuda de custo encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}