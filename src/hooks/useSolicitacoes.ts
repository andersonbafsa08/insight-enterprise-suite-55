import { useState, useEffect } from 'react';
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

  const fetchSolicitacoes = async () => {
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
  };

  const createSolicitacao = async (solicitacao: Omit<Solicitacao, 'id' | 'created_at' | 'updated_at'>) => {
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
  };

  const updateSolicitacao = async (id: string, updates: Partial<Solicitacao>) => {
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
  };

  const deleteSolicitacao = async (id: string) => {
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
  };

  const aprovarSolicitacao = async (id: string, aprovadorId: string) => {
    return updateSolicitacao(id, {
      status: 'Aprovada',
      aprovado_por: aprovadorId,
      data_aprovacao: new Date().toISOString(),
    });
  };

  const rejeitarSolicitacao = async (id: string) => {
    return updateSolicitacao(id, {
      status: 'Rejeitada',
    });
  };

  const getSolicitacoesPorStatus = (status: string) => {
    return solicitacoes.filter(s => s.status === status);
  };

  const getSolicitacoesPorTipo = (tipo: string) => {
    return solicitacoes.filter(s => s.tipo === tipo);
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  return {
    solicitacoes,
    isLoading,
    error,
    createSolicitacao,
    updateSolicitacao,
    deleteSolicitacao,
    aprovarSolicitacao,
    rejeitarSolicitacao,
    refetch: fetchSolicitacoes,
    getSolicitacoesPorStatus,
    getSolicitacoesPorTipo,
  };
};