import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Solicitacao {
  id: string;
  tipo: string;
  solicitante_id?: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  status: string;
  data_necessidade?: string;
  observacoes?: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  created_at: string;
  updated_at: string;
}

export const useSolicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSolicitacoes = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('solicitacoes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSolicitacoes(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar solicitações",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createSolicitacao = useCallback(async (solicitacao: Omit<Solicitacao, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes')
        .insert([solicitacao])
        .select()
        .single();
      
      if (error) throw error;
      
      setSolicitacoes(prev => [data, ...prev]);
      toast({
        title: "Solicitação criada",
        description: "Solicitação criada com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao criar solicitação",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  }, [toast]);

  const updateSolicitacao = useCallback(async (id: string, updates: Partial<Solicitacao>) => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setSolicitacoes(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Solicitação atualizada",
        description: "Solicitação atualizada com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar solicitação",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  }, [toast]);

  const deleteSolicitacao = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSolicitacoes(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Solicitação removida",
        description: "Solicitação removida com sucesso!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao remover solicitação",
        description: err.message,
        variant: "destructive",
      });
      return { error: err.message };
    }
  }, [toast]);

  const aprovarSolicitacao = useCallback(async (id: string, aprovadorId: string) => {
    return updateSolicitacao(id, {
      status: 'Aprovada',
      aprovado_por: aprovadorId,
      data_aprovacao: new Date().toISOString(),
    });
  }, [updateSolicitacao]);

  const rejeitarSolicitacao = useCallback(async (id: string) => {
    return updateSolicitacao(id, {
      status: 'Rejeitada',
    });
  }, [updateSolicitacao]);

  // Memoized computed values
  const getSolicitacoesPorStatus = useCallback((status: string) => {
    return solicitacoes.filter(s => s.status === status);
  }, [solicitacoes]);

  const getSolicitacoesPorTipo = useCallback((tipo: string) => {
    return solicitacoes.filter(s => s.tipo === tipo);
  }, [solicitacoes]);

  // Statistics for dashboard
  const stats = useMemo(() => ({
    total: solicitacoes.length,
    pendentes: solicitacoes.filter(s => s.status === 'Pendente').length,
    aprovadas: solicitacoes.filter(s => s.status === 'Aprovada').length,
    rejeitadas: solicitacoes.filter(s => s.status === 'Rejeitada').length,
  }), [solicitacoes]);

  useEffect(() => {
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  return useMemo(() => ({
    solicitacoes,
    isLoading,
    error,
    stats,
    createSolicitacao,
    updateSolicitacao,
    deleteSolicitacao,
    aprovarSolicitacao,
    rejeitarSolicitacao,
    refetch: fetchSolicitacoes,
    getSolicitacoesPorStatus,
    getSolicitacoesPorTipo,
  }), [
    solicitacoes,
    isLoading,
    error,
    stats,
    createSolicitacao,
    updateSolicitacao,
    deleteSolicitacao,
    aprovarSolicitacao,
    rejeitarSolicitacao,
    fetchSolicitacoes,
    getSolicitacoesPorStatus,
    getSolicitacoesPorTipo,
  ]);
};