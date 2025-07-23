import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cnpj_cpf?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  contato_responsavel?: string;
  observacoes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setClientes(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar clientes",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCliente = async (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()
        .single();
      
      if (error) throw error;
      
      setClientes(prev => [...prev, data]);
      toast({
        title: "Cliente criado",
        description: "Cliente criado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao criar cliente",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setClientes(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar cliente",
        description: err.message,
        variant: "destructive",
      });
      return { data: null, error: err.message };
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClientes(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Erro ao remover cliente",
        description: err.message,
        variant: "destructive",
      });
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    isLoading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    refetch: fetchClientes,
  };
};