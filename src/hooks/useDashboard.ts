import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalClientes: number;
  solicitacoesAtivas: number;
  colaboradores: number;
  itensEstoque: number;
  frotaAtiva: number;
  valorAjudas: number;
  taxaAprovacao: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    solicitacoesAtivas: 0,
    colaboradores: 0,
    itensEstoque: 0,
    frotaAtiva: 0,
    valorAjudas: 0,
    taxaAprovacao: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        clientesResult,
        solicitacoesResult,
        colaboradoresResult,
        estoqueResult,
        frotaResult,
        ajudasResult,
      ] = await Promise.allSettled([
        supabase.from('clientes').select('id', { count: 'exact', head: true }),
        supabase.from('solicitacoes').select('id, status', { count: 'exact', head: true }),
        supabase.from('colaboradores').select('id', { count: 'exact', head: true }),
        supabase.from('estoque').select('id', { count: 'exact', head: true }),
        supabase.from('frota').select('id, status').eq('status', 'Disponível'),
        supabase.from('ajudas_custo').select('valor, status').eq('status', 'Aprovada'),
      ]);

      // Process results safely
      const totalClientes = clientesResult.status === 'fulfilled' ? clientesResult.value.count || 0 : 0;
      const solicitacoesAtivas = solicitacoesResult.status === 'fulfilled' ? solicitacoesResult.value.count || 0 : 0;
      const colaboradores = colaboradoresResult.status === 'fulfilled' ? colaboradoresResult.value.count || 0 : 0;
      const itensEstoque = estoqueResult.status === 'fulfilled' ? estoqueResult.value.count || 0 : 0;
      const frotaAtiva = frotaResult.status === 'fulfilled' ? frotaResult.value.data?.length || 0 : 0;
      
      // Calculate total approved allowances
      const valorAjudas = ajudasResult.status === 'fulfilled' 
        ? ajudasResult.value.data?.reduce((sum, ajuda) => sum + (Number(ajuda.valor) || 0), 0) || 0
        : 0;

      // Calculate approval rate (mock for now)
      const taxaAprovacao = 94.2;

      setStats({
        totalClientes,
        solicitacoesAtivas,
        colaboradores,
        itensEstoque,
        frotaAtiva,
        valorAjudas,
        taxaAprovacao,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized formatted values
  const formattedStats = useMemo(() => ({
    totalClientes: stats.totalClientes.toString(),
    solicitacoesAtivas: stats.solicitacoesAtivas.toString(),
    colaboradores: stats.colaboradores.toString(),
    itensEstoque: stats.itensEstoque.toLocaleString('pt-BR'),
    frotaAtiva: stats.frotaAtiva.toString(),
    valorAjudas: `R$ ${stats.valorAjudas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    taxaAprovacao: `${stats.taxaAprovacao.toFixed(1)}%`,
  }), [stats]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    formattedStats,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}