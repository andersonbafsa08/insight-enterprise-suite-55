import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Filter, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Programacao {
  id: string;
  cliente_id: string;
  data_atendimento: string;
  dia_semana: string;
  status: string;
  data_saida: string;
  hora_saida: string;
  local: string;
  tipo: string;
  equipe_ids: string[];
  motorista_id?: string;
  veiculo_id?: string;
  escolta_id?: string;
  hospedagem?: string;
  observacoes?: string;
  programacao_formatada?: string;
  cliente?: { nome: string };
  motorista?: { nome: string };
  veiculo?: { modelo: string; tipo: string };
  escolta?: { nome: string };
  equipe?: { nome: string }[];
}

interface FormData {
  cliente_id: string;
  data_atendimento: Date | undefined;
  data_saida: Date | undefined;
  hora_saida: string;
  local: string;
  tipo: string;
  status: string;
  equipe_ids: string[];
  motorista_id: string;
  veiculo_id: string;
  escolta_id: string;
  hospedagem: string;
  observacoes: string;
}

const Scheduling = () => {
  const [programacoes, setProgramacoes] = useState<Programacao[]>([]);
  const [filteredProgramacoes, setFilteredProgramacoes] = useState<Programacao[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [frota, setFrota] = useState<any[]>([]);
  const [escolta, setEscolta] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProgramacao, setEditingProgramacao] = useState<Programacao | null>(null);
  const [viewingProgramacao, setViewingProgramacao] = useState<Programacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  
  const [formData, setFormData] = useState<FormData>({
    cliente_id: "",
    data_atendimento: undefined,
    data_saida: undefined,
    hora_saida: "",
    local: "",
    tipo: "",
    status: "Previsto",
    equipe_ids: [],
    motorista_id: "",
    veiculo_id: "",
    escolta_id: "",
    hospedagem: "",
    observacoes: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [programacoes, filterClient, filterStatus, filterDate]);

  const loadData = async () => {
    try {
      // Use any to bypass TypeScript until tables are properly typed
      const programacoesRes = await (supabase as any).from("programacoes").select("*").order("data_atendimento", { ascending: false });
      const clientesRes = await (supabase as any).from("clientes").select("id, nome").order("nome");
      const colaboradoresRes = await (supabase as any).from("colaboradores").select("id, nome").order("nome");
      const frotaRes = await (supabase as any).from("frota").select("id, modelo, tipo").order("modelo");
      const escoltaRes = await (supabase as any).from("escolta").select("id, nome").order("nome");

      if (programacoesRes.data) setProgramacoes(programacoesRes.data);
      if (clientesRes.data) setClientes(clientesRes.data);
      if (colaboradoresRes.data) setColaboradores(colaboradoresRes.data);
      if (frotaRes.data) setFrota(frotaRes.data);
      if (escoltaRes.data) setEscolta(escoltaRes.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = programacoes.filter(programacao => {
      if (filterClient) {
        const cliente = clientes.find(c => c.id === programacao.cliente_id);
        if (!cliente?.nome?.toLowerCase().includes(filterClient.toLowerCase())) {
          return false;
        }
      }

      if (filterStatus && programacao.status !== filterStatus) {
        return false;
      }

      if (filterDate) {
        const filterDateStr = format(filterDate, "yyyy-MM-dd");
        if (programacao.data_atendimento !== filterDateStr) {
          return false;
        }
      }

      return true;
    });

    setFilteredProgramacoes(filtered);
  };

  const resetForm = () => {
    setFormData({
      cliente_id: "",
      data_atendimento: undefined,
      data_saida: undefined,
      hora_saida: "",
      local: "",
      tipo: "",
      status: "Previsto",
      equipe_ids: [],
      motorista_id: "",
      veiculo_id: "",
      escolta_id: "",
      hospedagem: "",
      observacoes: ""
    });
    setEditingProgramacao(null);
  };

  const handleEdit = (programacao: Programacao) => {
    setFormData({
      cliente_id: programacao.cliente_id,
      data_atendimento: new Date(programacao.data_atendimento),
      data_saida: new Date(programacao.data_saida),
      hora_saida: programacao.hora_saida,
      local: programacao.local,
      tipo: programacao.tipo,
      status: programacao.status,
      equipe_ids: programacao.equipe_ids,
      motorista_id: programacao.motorista_id || "",
      veiculo_id: programacao.veiculo_id || "",
      escolta_id: programacao.escolta_id || "",
      hospedagem: programacao.hospedagem || "",
      observacoes: programacao.observacoes || ""
    });
    setEditingProgramacao(programacao);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any).from("programacoes").delete().eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Programação excluída com sucesso",
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir programação",
        variant: "destructive"
      });
    }
  };

  const handleView = (programacao: Programacao) => {
    setViewingProgramacao(programacao);
    setIsViewModalOpen(true);
  };

  const handleCopyFormatted = async (programacao: Programacao) => {
    if (programacao.programacao_formatada) {
      await navigator.clipboard.writeText(programacao.programacao_formatada);
      toast({
        title: "Copiado",
        description: "Programação formatada copiada para a área de transferência"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente_id || !formData.data_atendimento || !formData.data_saida || 
        !formData.hora_saida || !formData.local || !formData.tipo || formData.equipe_ids.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataToSave = {
        cliente_id: formData.cliente_id,
        data_atendimento: format(formData.data_atendimento, "yyyy-MM-dd"),
        data_saida: format(formData.data_saida, "yyyy-MM-dd"),
        hora_saida: formData.hora_saida,
        local: formData.local,
        tipo: formData.tipo,
        status: formData.status,
        equipe_ids: formData.equipe_ids,
        motorista_id: formData.motorista_id || null,
        veiculo_id: formData.veiculo_id || null,
        escolta_id: formData.escolta_id || null,
        hospedagem: formData.hospedagem || null,
        observacoes: formData.observacoes || null
      };

      let error;

      if (editingProgramacao) {
        const result = await (supabase as any)
          .from("programacoes")
          .update(dataToSave)
          .eq("id", editingProgramacao.id);
        error = result.error;
      } else {
        const result = await (supabase as any)
          .from("programacoes")
          .insert(dataToSave);
        error = result.error;
      }

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Erro",
            description: "Já existe uma programação para este cliente nesta data",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: editingProgramacao ? "Programação atualizada" : "Programação criada"
      });

      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar programação",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Programação de Atendimentos</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Programação
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Cliente</Label>
            <Input
              placeholder="Filtrar por cliente..."
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Previsto">Previsto</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterDate ? format(filterDate, "dd/MM/yyyy") : "Filtrar por data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Atendimento</TableHead>
                <TableHead>Dia da Semana</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProgramacoes.map((programacao) => {
                // Get client name
                const cliente = clientes.find(c => c.id === programacao.cliente_id);
                const motorista = colaboradores.find(c => c.id === programacao.motorista_id);
                const veiculo = frota.find(v => v.id === programacao.veiculo_id);
                
                return (
                <TableRow key={programacao.id}>
                  <TableCell className="font-medium">
                    {cliente?.nome || "Cliente não encontrado"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(programacao.data_atendimento), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{programacao.dia_semana}</TableCell>
                  <TableCell>{programacao.local}</TableCell>
                  <TableCell>
                    <Badge variant={programacao.status === "Confirmado" ? "default" : "secondary"}>
                      {programacao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{motorista?.nome || "-"}</TableCell>
                  <TableCell>
                    {veiculo ? `${veiculo.tipo} - ${veiculo.modelo}` : "-"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleView(programacao)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(programacao)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(programacao.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyFormatted(programacao)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
              })}
              {filteredProgramacoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma programação encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Formulário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProgramacao ? "Editar Programação" : "Nova Programação"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Cliente *</Label>
                <Select value={formData.cliente_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Previsto">Previsto</SelectItem>
                    <SelectItem value="Confirmado">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Data do Atendimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.data_atendimento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data_atendimento ? format(formData.data_atendimento, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.data_atendimento}
                      onSelect={(date) => setFormData(prev => ({ ...prev, data_atendimento: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Data de Saída *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.data_saida && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data_saida ? format(formData.data_saida, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.data_saida}
                      onSelect={(date) => setFormData(prev => ({ ...prev, data_saida: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Horário de Saída *</Label>
                <Input
                  type="time"
                  value={formData.hora_saida}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora_saida: e.target.value }))}
                />
              </div>

              <div>
                <Label>Local (Cidade) *</Label>
                <Input
                  value={formData.local}
                  onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
                  placeholder="Digite a cidade"
                />
              </div>

              <div>
                <Label>Tipo de Atendimento *</Label>
                <Input
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  placeholder="Ex: Manutenção, Instalação..."
                />
              </div>

              <div>
                <Label>Hospedagem</Label>
                <Input
                  value={formData.hospedagem}
                  onChange={(e) => setFormData(prev => ({ ...prev, hospedagem: e.target.value }))}
                  placeholder="Nome do hotel/pousada"
                />
              </div>

              <div>
                <Label>Motorista</Label>
                <Select value={formData.motorista_id} onValueChange={(value) => setFormData(prev => ({ ...prev, motorista_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.map(colaborador => (
                      <SelectItem key={colaborador.id} value={colaborador.id}>
                        {colaborador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Veículo</Label>
                <Select value={formData.veiculo_id} onValueChange={(value) => setFormData(prev => ({ ...prev, veiculo_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {frota.map(veiculo => (
                      <SelectItem key={veiculo.id} value={veiculo.id}>
                        {veiculo.tipo} - {veiculo.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Escolta</Label>
                <Select value={formData.escolta_id} onValueChange={(value) => setFormData(prev => ({ ...prev, escolta_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escolta" />
                  </SelectTrigger>
                  <SelectContent>
                    {escolta.map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Equipe *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                {colaboradores.map(colaborador => (
                  <label key={colaborador.id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.equipe_ids.includes(colaborador.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            equipe_ids: [...prev.equipe_ids, colaborador.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            equipe_ids: prev.equipe_ids.filter(id => id !== colaborador.id)
                          }));
                        }
                      }}
                    />
                    <span>{colaborador.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingProgramacao ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar Programação</DialogTitle>
          </DialogHeader>
          {viewingProgramacao && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleCopyFormatted(viewingProgramacao)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copiar Programação
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {viewingProgramacao.programacao_formatada}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scheduling;