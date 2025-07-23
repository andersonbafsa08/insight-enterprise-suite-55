import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActivityItem {
  id: string;
  type: "client" | "request" | "employee" | "system";
  action: string;
  details: string;
  user: string;
  timestamp: Date;
  status?: "success" | "warning" | "error";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "client",
    action: "Novo cliente cadastrado",
    details: "Hotel Vista Mar - São Paulo",
    user: "Maria Silva",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "success"
  },
  {
    id: "2",
    type: "request",
    action: "Solicitação de hotel",
    details: "Hospedagem para 3 pessoas - 2 diárias",
    user: "João Santos",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "employee",
    action: "Atualização de dados",
    details: "Valores de diária atualizados",
    user: "Admin",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "system",
    action: "Backup realizado",
    details: "Backup automático dos dados",
    user: "Sistema",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: "success"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "client": return "bg-primary";
    case "request": return "bg-warning";
    case "employee": return "bg-accent";
    case "system": return "bg-muted";
    default: return "bg-secondary";
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  switch (status) {
    case "success":
      return <Badge variant="outline" className="text-accent border-accent">Sucesso</Badge>;
    case "warning":
      return <Badge variant="outline" className="text-warning border-warning">Atenção</Badge>;
    case "error":
      return <Badge variant="destructive">Erro</Badge>;
    default:
      return null;
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={getTypeColor(activity.type)}>
                {activity.user.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {activity.action}
                </p>
                {getStatusBadge(activity.status)}
              </div>
              
              <p className="text-xs text-muted-foreground">
                {activity.details}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  por {activity.user}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <button className="text-sm text-primary hover:text-primary-hover transition-colors">
            Ver todas as atividades →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}