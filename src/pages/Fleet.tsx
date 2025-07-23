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
import { useFrota } from "@/hooks/useFrota";

// Interface já definida no hook useFrota - dados reais do Supabase

export default function Fleet() {
  const { veiculos, isLoading, createVeiculo, updateVeiculo, deleteVeiculo } = useFrota();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [newVeiculo, setNewVeiculo] = useState({
    modelo: "",
    marca: "",
    ano: new Date().getFullYear(),
    placa: "",
    tipo: "",
    capacidade: "",
    status: "Disponível" as const,
    quilometragem: 0,
    data_aquisicao: "",
    valor_aquisicao: 0,
    observacoes: ""
  });

  const filteredVeiculos = veiculos.filter(veiculo => {
    const matchesSearch = veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || veiculo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'default';
      case 'Em Uso': return 'secondary';
      case 'Manutenção': return 'destructive';
      default: return 'default';
    }
  };

  const handleCreateVeiculo = async () => {
    const result = await createVeiculo(newVeiculo);
    if (result.data) {
      setIsAddVehicleOpen(false);
      setNewVeiculo({
        modelo: "",
        marca: "",
        ano: new Date().getFullYear(),
        placa: "",
        tipo: "",
        capacidade: "",
        status: "Disponível",
        quilometragem: 0,
        data_aquisicao: "",
        valor_aquisicao: 0,
        observacoes: ""
      });
    }
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
                    <Input 
                      id="placa" 
                      value={newVeiculo.placa}
                      onChange={(e) => setNewVeiculo({...newVeiculo, placa: e.target.value})}
                      placeholder="ABC-1234" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={newVeiculo.tipo} onValueChange={(value) => setNewVeiculo({...newVeiculo, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UMB">UMB</SelectItem>
                        <SelectItem value="BAU">BAU</SelectItem>
                        <SelectItem value="APOIO">APOIO</SelectItem>
                        <SelectItem value="VAN">Van</SelectItem>
                        <SelectItem value="CAMINHAO">Caminhão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input 
                      id="marca" 
                      value={newVeiculo.marca}
                      onChange={(e) => setNewVeiculo({...newVeiculo, marca: e.target.value})}
                      placeholder="Ex: Honda" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input 
                      id="modelo" 
                      value={newVeiculo.modelo}
                      onChange={(e) => setNewVeiculo({...newVeiculo, modelo: e.target.value})}
                      placeholder="Ex: Civic" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano</Label>
                    <Input 
                      id="ano" 
                      type="number" 
                      value={newVeiculo.ano}
                      onChange={(e) => setNewVeiculo({...newVeiculo, ano: parseInt(e.target.value) || new Date().getFullYear()})}
                      placeholder="2024" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quilometragem">Quilometragem</Label>
                    <Input 
                      id="quilometragem" 
                      type="number" 
                      value={newVeiculo.quilometragem}
                      onChange={(e) => setNewVeiculo({...newVeiculo, quilometragem: parseInt(e.target.value) || 0})}
                      placeholder="0" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidade">Capacidade</Label>
                    <Input 
                      id="capacidade" 
                      value={newVeiculo.capacidade}
                      onChange={(e) => setNewVeiculo({...newVeiculo, capacidade: e.target.value})}
                      placeholder="Ex: 5 passageiros" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateVeiculo} disabled={isLoading}>
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
            <div className="text-2xl font-bold">{veiculos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {veiculos.filter(v => v.status === 'Disponível').length}
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
              {veiculos.filter(v => v.status === 'Em Uso').length}
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
              {veiculos.filter(v => v.status === 'Manutenção').length}
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
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Em Uso">Em Uso</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
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
                  {filteredVeiculos.map((veiculo) => (
                    <TableRow key={veiculo.id}>
                      <TableCell className="font-medium">{veiculo.placa}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{veiculo.marca} {veiculo.modelo}</div>
                          <div className="text-sm text-muted-foreground">{veiculo.ano}</div>
                        </div>
                      </TableCell>
                      <TableCell>{veiculo.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(veiculo.status)}>
                          {veiculo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{veiculo.quilometragem?.toLocaleString() || 0} km</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance Table - Funcionalidade removida temporariamente */}
          <Card>
            <CardHeader>
              <CardTitle>Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Funcionalidade de manutenções será implementada em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}