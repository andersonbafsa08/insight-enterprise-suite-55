import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Route, 
  TrendingUp, 
  FileText, 
  Camera, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Prediction {
  id: string;
  type: "maintenance" | "stock" | "route";
  title: string;
  description: string;
  confidence: number;
  urgency: "low" | "medium" | "high";
  estimatedDate: string;
  status: "pending" | "processing" | "completed";
}

interface OCRDocument {
  id: string;
  filename: string;
  uploadDate: string;
  status: "processing" | "completed" | "error";
  extractedText?: string;
  confidence: number;
}

const mockPredictions: Prediction[] = [
  {
    id: "1",
    type: "maintenance",
    title: "Manutenção Preventiva - Veículo ABC-1234",
    description: "Baseado no histórico, o veículo precisará de manutenção em breve",
    confidence: 87,
    urgency: "medium",
    estimatedDate: "2024-02-15",
    status: "pending"
  },
  {
    id: "2",
    type: "stock",
    title: "Estoque Baixo - Uniformes Tamanho M",
    description: "Previsão de estoque insuficiente baseada no consumo",
    confidence: 92,
    urgency: "high",
    estimatedDate: "2024-01-30",
    status: "completed"
  }
];

const mockOCRDocuments: OCRDocument[] = [
  {
    id: "1",
    filename: "nota_fiscal_001.pdf",
    uploadDate: "2024-01-20",
    status: "completed",
    extractedText: "NOTA FISCAL ELETRÔNICA...",
    confidence: 95
  },
  {
    id: "2",
    filename: "contrato_hotel.jpg",
    uploadDate: "2024-01-19",
    status: "processing",
    confidence: 0
  }
];

export default function AI() {
  const [predictions] = useState<Prediction[]>(mockPredictions);
  const [ocrDocuments] = useState<OCRDocument[]>(mockOCRDocuments);

  const getUrgencyBadge = (urgency: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive"> = {
      low: "secondary",
      medium: "default", 
      high: "destructive"
    };
    return <Badge variant={variants[urgency] || "default"}>{urgency}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      error: "destructive"
    };
    const icons: Record<string, any> = {
      pending: Clock,
      processing: Zap,
      completed: CheckCircle,
      error: AlertTriangle
    };
    const Icon = icons[status] || Clock;
    
    return (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <Badge variant={variants[status] || "default"}>{status}</Badge>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inteligência Artificial</h1>
            <p className="text-muted-foreground">Previsões, otimizações e análise de documentos</p>
          </div>
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions" className="gap-2">
              <Brain className="h-4 w-4" />
              Previsões
            </TabsTrigger>
            <TabsTrigger value="routes" className="gap-2">
              <Route className="h-4 w-4" />
              Otimização
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Análises
            </TabsTrigger>
            <TabsTrigger value="ocr" className="gap-2">
              <FileText className="h-4 w-4" />
              OCR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            {/* Resumo de Previsões */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alta Prioridade</p>
                      <p className="text-2xl font-bold text-foreground">
                        {predictions.filter(p => p.urgency === "high").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                      <p className="text-2xl font-bold text-foreground">
                        {predictions.filter(p => p.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                      <p className="text-2xl font-bold text-foreground">
                        {predictions.filter(p => p.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Previsões */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Previsões Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Confiança</TableHead>
                      <TableHead>Urgência</TableHead>
                      <TableHead>Data Estimada</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {predictions.map((prediction) => (
                      <TableRow key={prediction.id}>
                        <TableCell className="font-medium">{prediction.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{prediction.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={prediction.confidence} className="w-16 h-2" />
                            <span className="text-sm">{prediction.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getUrgencyBadge(prediction.urgency)}</TableCell>
                        <TableCell>{new Date(prediction.estimatedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(prediction.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Ver Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Otimização de Rotas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Configure destinos para otimizar automaticamente as rotas de viagem
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <Route className="h-12 w-12 text-primary mx-auto" />
                          <h3 className="font-semibold">Economia Média</h3>
                          <p className="text-2xl font-bold text-success">23%</p>
                          <p className="text-sm text-muted-foreground">Em tempo de viagem</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <TrendingUp className="h-12 w-12 text-accent mx-auto" />
                          <h3 className="font-semibold">Rotas Otimizadas</h3>
                          <p className="text-2xl font-bold text-foreground">147</p>
                          <p className="text-sm text-muted-foreground">Este mês</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button className="w-full">
                    Otimizar Nova Rota
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análise Preditiva de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Análises baseadas em padrões de consumo e sazonalidade
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-6 w-6 text-success" />
                          </div>
                          <h3 className="font-semibold">Estoque OK</h3>
                          <p className="text-2xl font-bold text-success">78%</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                            <AlertTriangle className="h-6 w-6 text-warning" />
                          </div>
                          <h3 className="font-semibold">Atenção</h3>
                          <p className="text-2xl font-bold text-warning">15%</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                          </div>
                          <h3 className="font-semibold">Crítico</h3>
                          <p className="text-2xl font-bold text-destructive">7%</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ocr" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  OCR - Digitalização de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload de Documentos</h3>
                    <p className="text-muted-foreground mb-4">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Selecionar Arquivos
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Tirar Foto
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Documentos Processados</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Arquivo</TableHead>
                          <TableHead>Data Upload</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Confiança</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ocrDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.filename}</TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(doc.status)}</TableCell>
                            <TableCell>
                              {doc.confidence > 0 && (
                                <div className="flex items-center gap-2">
                                  <Progress value={doc.confidence} className="w-16 h-2" />
                                  <span className="text-sm">{doc.confidence}%</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">Ver Texto</Button>
                                <Button variant="ghost" size="sm">Download</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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