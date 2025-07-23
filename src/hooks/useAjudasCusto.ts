import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AjudaCusto {
  id: string;
  colaborador_id?: string;
  cliente_id?: string;
  tipo: string;
  descricao: string;
  valor: number;
  data_gasto: string;
  status: string;
  comprovante_url?: string;
  observacoes?: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  created_at: string;
  updated_at: string;
}

export const useAjudasCusto = () => {
  const [ajudas, setAjudas] = useState<AjudaCusto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAjudas = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ajudas_custo')
        .select('*')
        .order('data_gasto', { ascending: false });
      
      if (error) throw error;
      setAjudas(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar ajudas de custo",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAjuda = async (ajuda: Omit<AjudaCusto, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ajudas_custo')
        .insert([ajuda])
        .select()
        .single();
      
      if (error) throw error;
      
      setAjudas(prev => [data, ...prev]);
      toast({
        title: "Ajuda de custo criada",
        description: "Ajuda de custo criada com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao criar ajuda de custo",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const updateAjuda = async (id: string, updates: Partial<AjudaCusto>) => {
    try {
      const { data, error } = await supabase
        .from('ajudas_custo')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAjudas(prev => prev.map(a => a.id === id ? data : a));
      toast({
        title: "Ajuda de custo atualizada",
        description: "Ajuda de custo atualizada com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar ajuda de custo",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const deleteAjuda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ajudas_custo')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAjudas(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Ajuda de custo removida",
        description: "Ajuda de custo removida com sucesso!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao remover ajuda de custo",
        description: err.message,
        variant: "destructive",
      });
      return { error: err.message };
    }
  };

  const aprovarAjuda = async (id: string, aprovadorId: string) => {
    return updateAjuda(id, {
      status: 'Aprovada',
      aprovado_por: aprovadorId,
      data_aprovacao: new Date().toISOString(),
    });
  };

  const rejeitarAjuda = async (id: string) => {
    return updateAjuda(id, {
      status: 'Rejeitada',
    });
  };

  const getAjudasPorStatus = (status: string) => {
    return ajudas.filter(a => a.status === status);
  };

  const getAjudasPorTipo = (tipo: string) => {
    return ajudas.filter(a => a.tipo === tipo);
  };

  const getTotalPorPeriodo = (dataInicio: string, dataFim: string) => {
    return ajudas
      .filter(a => a.data_gasto >= dataInicio && a.data_gasto <= dataFim)
      .reduce((total, a) => total + a.valor, 0);
  };

  const getTotalPorTipo = () => {
    const totais = ajudas.reduce((acc, ajuda) => {
      acc[ajuda.tipo] = (acc[ajuda.tipo] || 0) + ajuda.valor;
      return acc;
    }, {} as Record<string, number>);
    return totais;
  };

  useEffect(() => {
    fetchAjudas();
  }, []);

  return {
    ajudas,
    isLoading,
    error,
    createAjuda,
    updateAjuda,
    deleteAjuda,
    aprovarAjuda,
    rejeitarAjuda,
    refetch: fetchAjudas,
    getAjudasPorStatus,
    getAjudasPorTipo,
    getTotalPorPeriodo,
    getTotalPorTipo,
  };
};