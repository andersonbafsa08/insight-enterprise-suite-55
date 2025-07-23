import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ItemEstoque {
  id: string;
  nome: string;
  categoria: string;
  subcategoria?: string;
  codigo_interno?: string;
  quantidade_atual: number;
  quantidade_minima?: number;
  quantidade_maxima?: number;
  unidade_medida: string;
  valor_unitario?: number;
  fornecedor?: string;
  localizacao?: string;
  data_validade?: string;
  observacoes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useEstoque = () => {
  const [itens, setItens] = useState<ItemEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItens = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('estoque')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setItens(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar estoque",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (item: Omit<ItemEstoque, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('estoque')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      
      setItens(prev => [...prev, data]);
      toast({
        title: "Item criado",
        description: "Item criado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao criar item",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const updateItem = async (id: string, updates: Partial<ItemEstoque>) => {
    try {
      const { data, error } = await supabase
        .from('estoque')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setItens(prev => prev.map(i => i.id === id ? data : i));
      toast({
        title: "Item atualizado",
        description: "Item atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar item",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setItens(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Item removido",
        description: "Item removido com sucesso!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao remover item",
        description: err.message,
        variant: "destructive",
      });
      return { error: err.message };
    }
  };

  const getItensComEstoqueBaixo = () => {
    return itens.filter(item => 
      item.quantidade_minima && 
      item.quantidade_atual <= item.quantidade_minima
    );
  };

  const getValorTotalEstoque = () => {
    return itens.reduce((total, item) => {
      return total + ((item.valor_unitario || 0) * item.quantidade_atual);
    }, 0);
  };

  useEffect(() => {
    fetchItens();
  }, []);

  return {
    itens,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItens,
    getItensComEstoqueBaixo,
    getValorTotalEstoque,
  };
};