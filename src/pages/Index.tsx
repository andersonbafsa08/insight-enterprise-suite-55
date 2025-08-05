
import { memo } from "react";
import { DashboardCard, DashboardCardSkeleton } from "@/components/dashboard/DashboardCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { PendingTasks } from "@/components/dashboard/PendingTasks";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Users,
  Building2,
  UserCheck,
  Package,
  Car,
  CreditCard,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const IndexComponent = () => {
  const { formattedStats, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das atividades e métricas do sistema
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Clientes"
          value={formattedStats.totalClientes}
          description="Clientes ativos no sistema"
          icon={<Users />}
          trend={{ value: 12, isPositive: true }}
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Solicitações Ativas"
          value={formattedStats.solicitacoesAtivas}
          description="Aguardando processamento"
          icon={<Building2 />}
          badge={{ text: "Pendente", variant: "outline" }}
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Colaboradores"
          value={formattedStats.colaboradores}
          description="Funcionários cadastrados"
          icon={<UserCheck />}
          trend={{ value: 5, isPositive: true }}
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Itens em Estoque"
          value={formattedStats.itensEstoque}
          description="Produtos disponíveis"
          icon={<Package />}
          badge={{ text: "Baixo", variant: "destructive" }}
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Frota Ativa"
          value={formattedStats.frotaAtiva}
          description="Veículos em operação"
          icon={<Car />}
          trend={{ value: 0, isPositive: true }}
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Valor em Ajudas"
          value={formattedStats.valorAjudas}
          description="Valor do mês atual"
          icon={<CreditCard />}
          trend={{ value: 8.5, isPositive: true }}
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Taxa de Aprovação"
          value={formattedStats.taxaAprovacao}
          description="Solicitações aprovadas"
          icon={<TrendingUp />}
          trend={{ value: 2.1, isPositive: true }}
          isLoading={isLoading}
        />
      </div>

      {/* Activity and Tasks Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <PendingTasks />
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors text-left">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Novo Cliente</div>
              <div className="text-xs text-muted-foreground">Cadastrar cliente</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors text-left">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Nova Solicitação</div>
              <div className="text-xs text-muted-foreground">Solicitar hotel</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors text-left">
            <UserCheck className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Novo Colaborador</div>
              <div className="text-xs text-muted-foreground">Cadastrar funcionário</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors text-left">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <div className="font-medium text-sm">Relatórios</div>
              <div className="text-xs text-muted-foreground">Gerar relatório</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoized component for better performance
const Index = memo(IndexComponent);

export default Index;
