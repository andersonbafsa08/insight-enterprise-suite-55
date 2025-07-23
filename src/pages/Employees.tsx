import { useState } from "react";
import { Plus, Search, Filter, MessageCircle, Edit, Trash2, Building } from "lucide-react";
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

interface Employee {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  funcao: string;
  filial: string;
  banco: string;
  agencia: string;
  conta: string;
  pix: string;
  valorDiaria: number;
  valorPernoite: number;
  ativo: boolean;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "123.456.789-00",
    email: "joao.silva@empresa.com",
    telefone: "(11) 99999-9999",
    funcao: "Gerente de Projetos",
    filial: "São Paulo",
    banco: "Banco do Brasil",
    agencia: "1234-5",
    conta: "12345-6",
    pix: "joao.silva@empresa.com",
    valorDiaria: 150.00,
    valorPernoite: 200.00,
    ativo: true
  },
  {
    id: "2",
    nome: "Maria Santos",
    cpf: "987.654.321-00",
    email: "maria.santos@empresa.com",
    telefone: "(11) 88888-8888",
    funcao: "Analista de Sistemas",
    filial: "São Paulo",
    banco: "Caixa Econômica",
    agencia: "5678-9",
    conta: "98765-4",
    pix: "(11) 88888-8888",
    valorDiaria: 120.00,
    valorPernoite: 180.00,
    ativo: true
  },
  {
    id: "3",
    nome: "Pedro Costa",
    cpf: "456.789.123-00",
    email: "pedro.costa@empresa.com",
    telefone: "(21) 77777-7777",
    funcao: "Coordenador",
    filial: "Rio de Janeiro",
    banco: "Itaú",
    agencia: "9876-5",
    conta: "54321-0",
    pix: "pedro.costa@empresa.com",
    valorDiaria: 130.00,
    valorPernoite: 190.00,
    ativo: true
  }
];

const filiais = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre"];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilial, setSelectedFilial] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilial = selectedFilial === "all" || employee.filial === selectedFilial;
    
    return matchesSearch && matchesFilial && employee.ativo;
  });

  const groupedEmployees = filiais.reduce((acc, filial) => {
    acc[filial] = filteredEmployees.filter(emp => emp.filial === filial);
    return acc;
  }, {} as Record<string, Employee[]>);

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, ativo: false } : emp
    ));
    toast({
      title: "Colaborador removido",
      description: "Colaborador foi desativado com sucesso.",
    });
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
                    <Input id="nome" placeholder="Digite o nome completo..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="email@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="funcao">Função</Label>
                    <Input id="funcao" placeholder="Digite a função..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filial">Filial</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a filial" />
                      </SelectTrigger>
                      <SelectContent>
                        {filiais.map(filial => (
                          <SelectItem key={filial} value={filial}>{filial}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados Bancários</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="banco">Banco</Label>
                    <Input id="banco" placeholder="Nome do banco..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agencia">Agência</Label>
                    <Input id="agencia" placeholder="0000-0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conta">Conta</Label>
                    <Input id="conta" placeholder="00000-0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pix">Chave PIX</Label>
                  <Input id="pix" placeholder="E-mail, telefone ou CPF..." />
                </div>
              </div>

              {/* Valores */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Valores de Diária</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorDiaria">Valor Diária (R$)</Label>
                    <Input id="valorDiaria" type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorPernoite">Valor Pernoite (R$)</Label>
                    <Input id="valorPernoite" type="number" placeholder="0.00" step="0.01" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
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
            <div className="text-2xl font-bold">{employees.filter(e => e.ativo).length}</div>
          </CardContent>
        </Card>
        {filiais.map(filial => (
          <Card key={filial}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{filial}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employees.filter(e => e.filial === filial && e.ativo).length}
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
        <Select value={selectedFilial} onValueChange={setSelectedFilial}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por filial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as filiais</SelectItem>
            {filiais.map(filial => (
              <SelectItem key={filial} value={filial}>{filial}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employees by Branch */}
      <Accordion type="multiple" defaultValue={filiais} className="space-y-4">
        {filiais.map(filial => (
          <AccordionItem key={filial} value={filial}>
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {filial}
                <Badge variant="secondary">
                  {groupedEmployees[filial]?.length || 0} colaboradores
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
                        <TableHead>Função</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Valor Diária</TableHead>
                        <TableHead>Valor Pernoite</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedEmployees[filial]?.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.nome}</TableCell>
                          <TableCell>{employee.funcao}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.telefone}</TableCell>
                          <TableCell>R$ {employee.valorDiaria.toFixed(2)}</TableCell>
                          <TableCell>R$ {employee.valorPernoite.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => openWhatsApp(employee.telefone)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Nenhum colaborador encontrado nesta filial
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