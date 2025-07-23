export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ajudas_custo: {
        Row: {
          aprovado_por: string | null
          cliente_id: string | null
          colaborador_id: string | null
          comprovante_url: string | null
          created_at: string
          data_aprovacao: string | null
          data_gasto: string
          descricao: string
          id: string
          observacoes: string | null
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          aprovado_por?: string | null
          cliente_id?: string | null
          colaborador_id?: string | null
          comprovante_url?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_gasto: string
          descricao: string
          id?: string
          observacoes?: string | null
          status?: string
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          aprovado_por?: string | null
          cliente_id?: string | null
          colaborador_id?: string | null
          comprovante_url?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_gasto?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          contato_responsavel: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          contato_responsavel?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          contato_responsavel?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      colaboradores: {
        Row: {
          cargo: string | null
          cep: string | null
          cidade: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          departamento: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          salario: number | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cargo?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          departamento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cargo?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          departamento?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      escolta: {
        Row: {
          certificacoes: string | null
          created_at: string
          empresa: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          certificacoes?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          certificacoes?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      estoque: {
        Row: {
          categoria: string
          codigo_interno: string | null
          created_at: string
          data_validade: string | null
          fornecedor: string | null
          id: string
          localizacao: string | null
          nome: string
          observacoes: string | null
          quantidade_atual: number
          quantidade_maxima: number | null
          quantidade_minima: number | null
          status: string
          subcategoria: string | null
          unidade_medida: string
          updated_at: string
          valor_unitario: number | null
        }
        Insert: {
          categoria: string
          codigo_interno?: string | null
          created_at?: string
          data_validade?: string | null
          fornecedor?: string | null
          id?: string
          localizacao?: string | null
          nome: string
          observacoes?: string | null
          quantidade_atual?: number
          quantidade_maxima?: number | null
          quantidade_minima?: number | null
          status?: string
          subcategoria?: string | null
          unidade_medida?: string
          updated_at?: string
          valor_unitario?: number | null
        }
        Update: {
          categoria?: string
          codigo_interno?: string | null
          created_at?: string
          data_validade?: string | null
          fornecedor?: string | null
          id?: string
          localizacao?: string | null
          nome?: string
          observacoes?: string | null
          quantidade_atual?: number
          quantidade_maxima?: number | null
          quantidade_minima?: number | null
          status?: string
          subcategoria?: string | null
          unidade_medida?: string
          updated_at?: string
          valor_unitario?: number | null
        }
        Relationships: []
      }
      frota: {
        Row: {
          ano: number | null
          capacidade: string | null
          created_at: string
          data_aquisicao: string | null
          id: string
          marca: string
          modelo: string
          observacoes: string | null
          placa: string
          quilometragem: number | null
          status: string
          tipo: string
          updated_at: string
          valor_aquisicao: number | null
        }
        Insert: {
          ano?: number | null
          capacidade?: string | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          marca: string
          modelo: string
          observacoes?: string | null
          placa: string
          quilometragem?: number | null
          status?: string
          tipo: string
          updated_at?: string
          valor_aquisicao?: number | null
        }
        Update: {
          ano?: number | null
          capacidade?: string | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          marca?: string
          modelo?: string
          observacoes?: string | null
          placa?: string
          quilometragem?: number | null
          status?: string
          tipo?: string
          updated_at?: string
          valor_aquisicao?: number | null
        }
        Relationships: []
      }
      programacoes: {
        Row: {
          cliente_id: string
          created_at: string
          data_atendimento: string
          data_saida: string
          dia_semana: string
          equipe_ids: string[]
          escolta_id: string | null
          hora_saida: string
          hospedagem: string | null
          id: string
          local: string
          motorista_id: string | null
          observacoes: string | null
          programacao_formatada: string | null
          status: string
          tipo: string
          updated_at: string
          veiculo_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_atendimento: string
          data_saida: string
          dia_semana: string
          equipe_ids: string[]
          escolta_id?: string | null
          hora_saida: string
          hospedagem?: string | null
          id?: string
          local: string
          motorista_id?: string | null
          observacoes?: string | null
          programacao_formatada?: string | null
          status?: string
          tipo: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_atendimento?: string
          data_saida?: string
          dia_semana?: string
          equipe_ids?: string[]
          escolta_id?: string | null
          hora_saida?: string
          hospedagem?: string | null
          id?: string
          local?: string
          motorista_id?: string | null
          observacoes?: string | null
          programacao_formatada?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Relationships: []
      }
      solicitacoes: {
        Row: {
          aprovado_por: string | null
          created_at: string
          data_aprovacao: string | null
          data_necessidade: string | null
          descricao: string
          id: string
          observacoes: string | null
          prioridade: string
          solicitante_id: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_necessidade?: string | null
          descricao: string
          id?: string
          observacoes?: string | null
          prioridade?: string
          solicitante_id?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_necessidade?: string | null
          descricao?: string
          id?: string
          observacoes?: string | null
          prioridade?: string
          solicitante_id?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
