import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Veiculo {
  id: string;
  modelo: string;
  marca: string;
  ano?: number;
  placa: string;
  tipo: string;
  capacidade?: string;
  status: string;
  quilometragem?: number;
  data_aquisicao?: string;
  valor_aquisicao?: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useFrota = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVeiculos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('frota')
        .select('*')
        .order('modelo');
      
      if (error) throw error;
      setVeiculos(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar frota",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createVeiculo = async (veiculo: Omit<Veiculo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('frota')
        .insert([veiculo])
        .select()
        .single();
      
      if (error) throw error;
      
      setVeiculos(prev => [...prev, data]);
      toast({
        title: "Veículo criado",
        description: "Veículo criado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao criar veículo",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const updateVeiculo = async (id: string, updates: Partial<Veiculo>) => {
    try {
      const { data, error } = await supabase
        .from('frota')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setVeiculos(prev => prev.map(v => v.id === id ? data : v));
      toast({
        title: "Veículo atualizado",
        description: "Veículo atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar veículo",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const deleteVeiculo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('frota')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setVeiculos(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Veículo removido",
        description: "Veículo removido com sucesso!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao remover veículo",
        description: err.message,
        variant: "destructive",
      });
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  return {
    veiculos,
    isLoading,
    error,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
    refetch: fetchVeiculos,
  };
};