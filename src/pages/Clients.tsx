import { useState } from "react";
import { Search, Plus, MapPin, Edit, MessageSquare, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  id: string;
  cnpj: string;
  nome: string;
  contato: string;
  valorDiaria: number;
}

interface Client {
  id: string;
  nome: string;
  cidade: string;
  distancia: number;
  coordenadas: { lat: number; lng: number };
  hoteis: Hotel[];
}

const mockClients: Client[] = [
  {
    id: "1",
    nome: "Hotel Central Plaza",
    cidade: "São Paulo",
    distancia: 125,
    coordenadas: { lat: -23.5505, lng: -46.6333 },
    hoteis: [
      {
        id: "h1",
        cnpj: "12.345.678/0001-90",
        nome: "Plaza Executive",
        contato: "(11) 99999-9999",
        valorDiaria: 180.00
      }
    ]
  },
  {
    id: "2",
    nome: "Pousada Vista Alegre",
    cidade: "Rio de Janeiro",
    distancia: 430,
    coordenadas: { lat: -22.9068, lng: -43.1729 },
    hoteis: [
      {
        id: "h2",
        cnpj: "98.765.432/0001-10",
        nome: "Vista Copacabana",
        contato: "(21) 88888-8888",
        valorDiaria: 220.00
      }
    ]
  }
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const filteredClients = clients.filter(client =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    toast({
      title: "Cliente excluído",
      description: "Cliente e hotéis vinculados foram removidos com sucesso.",
    });
  };

  const openGoogleMaps = (coords: { lat: number; lng: number }) => {
    window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua carteira de clientes e hotéis</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome do Cliente</Label>
                <Input id="nome" placeholder="Digite o nome..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" placeholder="Digite a cidade..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distancia">Distância (km)</Label>
                <Input id="distancia" type="number" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" type="number" step="any" placeholder="-23.5505" />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" type="number" step="any" placeholder="-46.6333" />
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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{client.nome}</CardTitle>
                  <p className="text-muted-foreground">{client.cidade}</p>
                </div>
                <Badge variant="secondary">
                  {client.distancia} km
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hotéis */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Hotéis Vinculados</span>
                </div>
                {client.hoteis.length > 0 ? (
                  <div className="space-y-2">
                    {client.hoteis.map((hotel) => (
                      <div key={hotel.id} className="p-2 bg-muted/50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{hotel.nome}</p>
                            <p className="text-xs text-muted-foreground">{hotel.contato}</p>
                          </div>
                          <p className="text-sm font-medium text-primary">
                            R$ {hotel.valorDiaria.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Solicitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum hotel vinculado</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => openGoogleMaps(client.coordenadas)}
                >
                  <MapPin className="h-4 w-4" />
                  Localização
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Obs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteClient(client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
}