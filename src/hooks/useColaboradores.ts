import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Colaborador {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  cargo?: string;
  departamento?: string;
  data_admissao?: string;
  salario?: number;
  status: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  created_at: string;
  updated_at: string;
}

export const useColaboradores = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchColaboradores = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('colaboradores')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setColaboradores(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar colaboradores",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createColaborador = async (colaborador: Omit<Colaborador, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .insert([colaborador])
        .select()
        .single();
      
      if (error) throw error;
      
      setColaboradores(prev => [...prev, data]);
      toast({
        title: "Colaborador criado",
        description: "Colaborador criado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao criar colaborador",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const updateColaborador = async (id: string, updates: Partial<Colaborador>) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setColaboradores(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "Colaborador atualizado",
        description: "Colaborador atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar colaborador",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const deleteColaborador = async (id: string) => {
    try {
      const { error } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setColaboradores(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Colaborador removido",
        description: "Colaborador removido com sucesso!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao remover colaborador",
        description: err.message,
        variant: "destructive",
      });
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

  return {
    colaboradores,
    isLoading,
    error,
    createColaborador,
    updateColaborador,
    deleteColaborador,
    refetch: fetchColaboradores,
  };
};