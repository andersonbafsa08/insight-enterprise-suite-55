import { useState } from "react";
import { Plus, Search, Car, Fuel, Wrench, Calendar, MapPin } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  status: 'disponivel' | 'em_uso' | 'manutencao';
  quilometragem: number;
  proximaRevisao: string;
  combustivel: number; // percentual
  responsavel?: string;
  localizacao: string;
}

interface Maintenance {
  id: string;
  veiculoId: string;
  veiculo: string;
  tipo: string;
  descricao: string;
  data: string;
  valor: number;
  status: 'agendada' | 'em_andamento' | 'concluida';
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    placa: "ABC-1234",
    modelo: "Civic",
    marca: "Honda",
    ano: 2022,
    tipo: "Sedan",
    status: 'disponivel',
    quilometragem: 45000,
    proximaRevisao: "2024-04-15",
    combustivel: 75,
    localizacao: "Garagem Principal"
  },
  {
    id: "2",
    placa: "DEF-5678",
    modelo: "Strada",
    marca: "Fiat",
    ano: 2021,
    tipo: "Pickup",
    status: 'em_uso',
    quilometragem: 68000,
    proximaRevisao: "2024-03-25",
    combustivel: 40,
    responsavel: "João Silva",
    localizacao: "São Paulo - SP"
  },
  {
    id: "3",
    placa: "GHI-9012",
    modelo: "Sprinter",
    marca: "Mercedes",
    ano: 2020,
    tipo: "Van",
    status: 'manutencao',
    quilometragem: 120000,
    proximaRevisao: "2024-05-10",
    combustivel: 0,
    localizacao: "Oficina Externa"
  }
];

const mockMaintenance: Maintenance[] = [
  {
    id: "1",
    veiculoId: "1",
    veiculo: "Honda Civic - ABC-1234",
    tipo: "Revisão Preventiva",
    descricao: "Troca de óleo e filtros",
    data: "2024-04-15",
    valor: 350.00,
    status: 'agendada'
  },
  {
    id: "2",
    veiculoId: "3",
    veiculo: "Mercedes Sprinter - GHI-9012",
    tipo: "Reparo",
    descricao: "Substituição do motor de partida",
    data: "2024-03-10",
    valor: 850.00,
    status: 'em_andamento'
  }
];

export default function Fleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [maintenance, setMaintenance] = useState<Maintenance[]>(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'disponivel': return 'default';
      case 'em_uso': return 'secondary';
      case 'manutencao': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'em_uso': return 'Em Uso';
      case 'manutencao': return 'Manutenção';
      default: return status;
    }
  };

  const getFuelColor = (level: number) => {
    if (level <= 20) return 'text-destructive';
    if (level <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Frota</h1>
          <p className="text-muted-foreground">Gerencie veículos, manutenções e utilizações</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Wrench className="h-4 w-4" />
                Agendar Manutenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Agendar Manutenção</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="veiculo">Veículo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.marca} {vehicle.modelo} - {vehicle.placa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Manutenção</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventiva">Revisão Preventiva</SelectItem>
                      <SelectItem value="corretiva">Manutenção Corretiva</SelectItem>
                      <SelectItem value="reparo">Reparo</SelectItem>
                      <SelectItem value="lavagem">Lavagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input id="descricao" placeholder="Descreva o serviço..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor Estimado (R$)</Label>
                    <Input id="valor" type="number" placeholder="0.00" step="0.01" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsAddMaintenanceOpen(false)}>
                  Agendar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Veículo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input id="placa" placeholder="ABC-1234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="hatch">Hatch</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="caminhao">Caminhão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input id="marca" placeholder="Ex: Honda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input id="modelo" placeholder="Ex: Civic" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano</Label>
                    <Input id="ano" type="number" placeholder="2024" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quilometragem">Quilometragem</Label>
                    <Input id="quilometragem" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input id="localizacao" placeholder="Garagem Principal" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsAddVehicleOpen(false)}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.status === 'disponivel').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Uso</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {vehicles.filter(v => v.status === 'em_uso').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <Wrench className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {vehicles.filter(v => v.status === 'manutencao').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Veículos</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar veículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="em_uso">Em Uso</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicles Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Combustível</TableHead>
                    <TableHead>Quilometragem</TableHead>
                    <TableHead>Próxima Revisão</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Localização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.placa}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.marca} {vehicle.modelo}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.ano}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(vehicle.status)}>
                          {getStatusLabel(vehicle.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Fuel className={`h-4 w-4 ${getFuelColor(vehicle.combustivel)}`} />
                          <span className={getFuelColor(vehicle.combustivel)}>
                            {vehicle.combustivel}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.quilometragem.toLocaleString()} km</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(vehicle.proximaRevisao).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.responsavel || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {vehicle.localizacao}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Manutenções Programadas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.veiculo}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>R$ {item.valor.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === 'agendada' ? 'secondary' :
                          item.status === 'em_andamento' ? 'default' : 'destructive'
                        }>
                          {item.status === 'agendada' ? 'Agendada' :
                           item.status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}
                        </Badge>
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