import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Download, 
  Upload, 
  Mail, 
  MapPin,
  Building,
  Phone,
  Save
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CompanySettings {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  defaultRoute: string;
}

interface SystemSettings {
  enableNotifications: boolean;
  enableAuditLog: boolean;
  sessionTimeout: number;
  maxFileSize: number;
  backupFrequency: string;
}

const mockCompanySettings: CompanySettings = {
  name: "ERP Corporativo Ltda",
  cnpj: "12.345.678/0001-90",
  address: "Rua das Empresas, 123 - Centro",
  phone: "(11) 98765-4321",
  email: "contato@erpcorporativo.com.br",
  logo: "",
  defaultRoute: "dashboard"
};

const mockSystemSettings: SystemSettings = {
  enableNotifications: true,
  enableAuditLog: true,
  sessionTimeout: 60,
  maxFileSize: 10,
  backupFrequency: "daily"
};

export default function Settings() {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(mockCompanySettings);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(mockSystemSettings);

  const handleCompanyChange = (field: keyof CompanySettings, value: string) => {
    setCompanySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemChange = (field: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Configure o sistema e gerencia usuários</p>
          </div>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="company" className="gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <Download className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <Mail className="h-4 w-4" />
              Suporte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Dados da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      value={companySettings.name}
                      onChange={(e) => handleCompanyChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-cnpj">CNPJ</Label>
                    <Input
                      id="company-cnpj"
                      value={companySettings.cnpj}
                      onChange={(e) => handleCompanyChange('cnpj', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="company-address">Endereço</Label>
                    <Input
                      id="company-address"
                      value={companySettings.address}
                      onChange={(e) => handleCompanyChange('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telefone</Label>
                    <Input
                      id="company-phone"
                      value={companySettings.phone}
                      onChange={(e) => handleCompanyChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">E-mail</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => handleCompanyChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-route">Rota Padrão</Label>
                    <Select value={companySettings.defaultRoute} onValueChange={(value) => handleCompanyChange('defaultRoute', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="clients">Clientes</SelectItem>
                        <SelectItem value="requests">Solicitações</SelectItem>
                        <SelectItem value="employees">Colaboradores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-logo">Logo da Empresa</Label>
                    <Input id="company-logo" type="file" accept="image/*" />
                  </div>
                </div>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciamento de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">Gerencie usuários e suas permissões</p>
                  <Button>Adicionar Usuário</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Administrador</TableCell>
                      <TableCell>admin@empresa.com</TableCell>
                      <TableCell>
                        <Badge>Administrador</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Ativo</Badge>
                      </TableCell>
                      <TableCell>Hoje, 14:30</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Editar</Button>
                          <Button variant="ghost" size="sm">Logs</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações</Label>
                      <p className="text-sm text-muted-foreground">Ativar notificações do sistema</p>
                    </div>
                    <Switch
                      checked={systemSettings.enableNotifications}
                      onCheckedChange={(checked) => handleSystemChange('enableNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Log de Auditoria</Label>
                      <p className="text-sm text-muted-foreground">Registrar todas as ações dos usuários</p>
                    </div>
                    <Switch
                      checked={systemSettings.enableAuditLog}
                      onCheckedChange={(checked) => handleSystemChange('enableAuditLog', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Timeout de Sessão (minutos)</Label>
                    <Input
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => handleSystemChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tamanho Máximo de Arquivo (MB)</Label>
                    <Input
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => handleSystemChange('maxFileSize', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Frequência de Backup</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => handleSystemChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Backup e Restauração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Exportar Dados</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Baixe uma cópia completa dos dados do sistema
                    </p>
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Todos os Dados
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Importar Dados</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Restaure dados de um backup anterior
                    </p>
                    <div className="flex gap-2">
                      <Input type="file" accept=".json,.xlsx" />
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" />
                        Importar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Suporte Técnico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Contato</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>suporte@erpcorporativo.com.br</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>(11) 99999-9999</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Enviar Mensagem</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Assunto</Label>
                        <Input placeholder="Descreva brevemente o problema" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mensagem</Label>
                        <Textarea 
                          placeholder="Descreva detalhadamente o problema ou dúvida"
                          rows={5}
                        />
                      </div>
                      <Button className="gap-2">
                        <Mail className="h-4 w-4" />
                        Enviar Mensagem
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}