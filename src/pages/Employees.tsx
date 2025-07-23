import { useState } from "react";
import { Plus, Search, MessageCircle, Edit, Trash2, Building } from "lucide-react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useColaboradores } from "@/hooks/useColaboradores";

// Interface já definida no hook useColaboradores

const departamentos = ["Administrativo", "Operacional", "Vendas", "RH", "TI"];

export default function Employees() {
  const { colaboradores, isLoading, createColaborador, updateColaborador, deleteColaborador } = useColaboradores();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newColaborador, setNewColaborador] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cargo: "",
    departamento: "",
    data_admissao: "",
    salario: 0,
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    status: "Ativo" as const
  });
  const { toast } = useToast();

  const filteredColaboradores = colaboradores.filter(colaborador => {
    const matchesSearch = colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (colaborador.cargo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (colaborador.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartamento = selectedDepartamento === "all" || colaborador.departamento === selectedDepartamento;
    
    return matchesSearch && matchesDepartamento && colaborador.status === "Ativo";
  });

  const groupedColaboradores = departamentos.reduce((acc, departamento) => {
    acc[departamento] = filteredColaboradores.filter(emp => emp.departamento === departamento);
    return acc;
  }, {} as Record<string, any[]>);

  const handleDeleteColaborador = async (colaboradorId: string) => {
    await deleteColaborador(colaboradorId);
  };

  const handleCreateColaborador = async () => {
    const result = await createColaborador(newColaborador);
    if (result.data) {
      setIsAddDialogOpen(false);
      setNewColaborador({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        cargo: "",
        departamento: "",
        data_admissao: "",
        salario: 0,
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        status: "Ativo"
      });
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground">Central de gerenciamento de dados de funcionários</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Colaborador</DialogTitle>
            </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input 
                        id="nome" 
                        value={newColaborador.nome}
                        onChange={(e) => setNewColaborador({...newColaborador, nome: e.target.value})}
                        placeholder="Digite o nome completo..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input 
                        id="cpf" 
                        value={newColaborador.cpf}
                        onChange={(e) => setNewColaborador({...newColaborador, cpf: e.target.value})}
                        placeholder="000.000.000-00" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={newColaborador.email}
                        onChange={(e) => setNewColaborador({...newColaborador, email: e.target.value})}
                        placeholder="email@empresa.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input 
                        id="telefone" 
                        value={newColaborador.telefone}
                        onChange={(e) => setNewColaborador({...newColaborador, telefone: e.target.value})}
                        placeholder="(11) 99999-9999" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input 
                        id="cargo" 
                        value={newColaborador.cargo}
                        onChange={(e) => setNewColaborador({...newColaborador, cargo: e.target.value})}
                        placeholder="Digite o cargo..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Select value={newColaborador.departamento} onValueChange={(value) => setNewColaborador({...newColaborador, departamento: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {departamentos.map(departamento => (
                            <SelectItem key={departamento} value={departamento}>{departamento}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data_admissao">Data de Admissão</Label>
                      <Input 
                        id="data_admissao" 
                        type="date"
                        value={newColaborador.data_admissao}
                        onChange={(e) => setNewColaborador({...newColaborador, data_admissao: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salario">Salário</Label>
                      <Input 
                        id="salario" 
                        type="number"
                        value={newColaborador.salario}
                        onChange={(e) => setNewColaborador({...newColaborador, salario: parseFloat(e.target.value) || 0})}
                        placeholder="0.00" 
                        step="0.01" 
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input 
                      id="endereco" 
                      value={newColaborador.endereco}
                      onChange={(e) => setNewColaborador({...newColaborador, endereco: e.target.value})}
                      placeholder="Rua, número..." 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input 
                        id="cidade" 
                        value={newColaborador.cidade}
                        onChange={(e) => setNewColaborador({...newColaborador, cidade: e.target.value})}
                        placeholder="Cidade" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input 
                        id="estado" 
                        value={newColaborador.estado}
                        onChange={(e) => setNewColaborador({...newColaborador, estado: e.target.value})}
                        placeholder="UF" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input 
                        id="cep" 
                        value={newColaborador.cep}
                        onChange={(e) => setNewColaborador({...newColaborador, cep: e.target.value})}
                        placeholder="00000-000" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateColaborador} disabled={isLoading}>
                  Salvar
                </Button>
              </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colaboradores.filter(c => c.status === "Ativo").length}</div>
          </CardContent>
        </Card>
        {departamentos.slice(0, 3).map(departamento => (
          <Card key={departamento}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{departamento}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {colaboradores.filter(c => c.departamento === departamento && c.status === "Ativo").length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDepartamento} onValueChange={setSelectedDepartamento}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departamentos.map(departamento => (
              <SelectItem key={departamento} value={departamento}>{departamento}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employees by Department */}
      <Accordion type="multiple" defaultValue={departamentos} className="space-y-4">
        {departamentos.map(departamento => (
          <AccordionItem key={departamento} value={departamento}>
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {departamento}
                <Badge variant="secondary">
                  {groupedColaboradores[departamento]?.length || 0} colaboradores
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Salário</TableHead>
                        <TableHead>Admissão</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedColaboradores[departamento]?.map((colaborador) => (
                        <TableRow key={colaborador.id}>
                          <TableCell className="font-medium">{colaborador.nome}</TableCell>
                          <TableCell>{colaborador.cargo || '-'}</TableCell>
                          <TableCell>{colaborador.email || '-'}</TableCell>
                          <TableCell>{colaborador.telefone || '-'}</TableCell>
                          <TableCell>{colaborador.salario ? `R$ ${colaborador.salario.toFixed(2)}` : '-'}</TableCell>
                          <TableCell>{colaborador.data_admissao ? new Date(colaborador.data_admissao).toLocaleDateString('pt-BR') : '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {colaborador.telefone && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => openWhatsApp(colaborador.telefone)}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteColaborador(colaborador.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Nenhum colaborador encontrado neste departamento
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}