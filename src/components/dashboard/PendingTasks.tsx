import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: "approval" | "review" | "action";
  dueDate?: Date;
  module: string;
}

const mockTasks: PendingTask[] = [
  {
    id: "1",
    title: "Aprovação de Solicitação",
    description: "Hotel Plaza - 5 pessoas, 3 diárias",
    priority: "high",
    type: "approval",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    module: "Solicitações"
  },
  {
    id: "2",
    title: "Revisão de Dados",
    description: "Validar informações do cliente Novo Horizonte",
    priority: "medium",
    type: "review",
    module: "Clientes"
  },
  {
    id: "3",
    title: "Atualização de Estoque",
    description: "Produtos com estoque baixo",
    priority: "low",
    type: "action",
    module: "Estoque"
  },
  {
    id: "4",
    title: "Configuração de Permissões",
    description: "Novo colaborador precisa de acesso",
    priority: "medium",
    type: "action",
    module: "Colaboradores"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "outline";
    case "low": return "secondary";
    default: return "secondary";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high": return <AlertTriangle className="h-3 w-3" />;
    case "medium": return <Clock className="h-3 w-3" />;
    case "low": return <CheckCircle className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
};

export function PendingTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tarefas Pendentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">
                  {task.title}
                </h4>
                <Badge 
                  variant={getPriorityColor(task.priority) as any}
                  className="flex items-center gap-1 text-xs"
                >
                  {getPriorityIcon(task.priority)}
                  {task.priority === "high" ? "Alta" : 
                   task.priority === "medium" ? "Média" : "Baixa"}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {task.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {task.module}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    Prazo: {task.dueDate.toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="ml-3">
              {task.type === "approval" ? "Aprovar" : 
               task.type === "review" ? "Revisar" : "Ação"}
            </Button>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <button className="text-sm text-primary hover:text-primary-hover transition-colors">
            Ver todas as tarefas →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}