import { z } from 'zod';

// Schema básico para UUID
export const uuidSchema = z.string().uuid();

// Schema para data
export const dateSchema = z.string().datetime().or(z.date()).transform((val) => 
  typeof val === 'string' ? new Date(val) : val
);

// Schema para data simples (YYYY-MM-DD)
export const simpleDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Schema para Cliente
export const clienteSchema = z.object({
  id: uuidSchema.optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  cnpj_cpf: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  contato_responsavel: z.string().optional(),
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  observacoes: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Colaborador
export const colaboradorSchema = z.object({
  id: uuidSchema.optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  cargo: z.string().optional(),
  departamento: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  data_admissao: simpleDateSchema.optional(),
  salario: z.number().positive().optional(),
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Veículo (Frota)
export const veiculoSchema = z.object({
  id: uuidSchema.optional(),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  placa: z.string().min(1, 'Placa é obrigatória'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  ano: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  capacidade: z.string().optional(),
  quilometragem: z.number().int().min(0).default(0),
  valor_aquisicao: z.number().positive().optional(),
  data_aquisicao: simpleDateSchema.optional(),
  status: z.enum(['Disponível', 'Em Uso', 'Manutenção', 'Inativo']).default('Disponível'),
  observacoes: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Item de Estoque
export const itemEstoqueSchema = z.object({
  id: uuidSchema.optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  subcategoria: z.string().optional(),
  codigo_interno: z.string().optional(),
  unidade_medida: z.string().default('UN'),
  quantidade_atual: z.number().int().min(0).default(0),
  quantidade_minima: z.number().int().min(0).default(0),
  quantidade_maxima: z.number().int().min(0).optional(),
  valor_unitario: z.number().positive().optional(),
  localizacao: z.string().optional(),
  fornecedor: z.string().optional(),
  data_validade: simpleDateSchema.optional(),
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  observacoes: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Solicitação
export const solicitacaoSchema = z.object({
  id: uuidSchema.optional(),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  prioridade: z.enum(['Baixa', 'Média', 'Alta', 'Crítica']).default('Média'),
  status: z.enum(['Pendente', 'Em Andamento', 'Aprovada', 'Rejeitada', 'Concluída']).default('Pendente'),
  data_necessidade: simpleDateSchema.optional(),
  solicitante_id: uuidSchema.optional(),
  aprovado_por: uuidSchema.optional(),
  data_aprovacao: dateSchema.optional(),
  observacoes: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Ajuda de Custo
export const ajudaCustoSchema = z.object({
  id: uuidSchema.optional(),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  data_gasto: simpleDateSchema,
  colaborador_id: uuidSchema.optional(),
  cliente_id: uuidSchema.optional(),
  comprovante_url: z.string().optional(),
  status: z.enum(['Pendente', 'Aprovada', 'Rejeitada', 'Paga']).default('Pendente'),
  aprovado_por: uuidSchema.optional(),
  data_aprovacao: dateSchema.optional(),
  observacoes: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Programação
export const programacaoSchema = z.object({
  id: uuidSchema.optional(),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  local: z.string().min(1, 'Local é obrigatório'),
  data_atendimento: simpleDateSchema,
  data_saida: simpleDateSchema,
  hora_saida: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  cliente_id: uuidSchema,
  motorista_id: uuidSchema.optional(),
  veiculo_id: uuidSchema.optional(),
  escolta_id: uuidSchema.optional(),
  equipe_ids: z.array(uuidSchema).default([]),
  hospedagem: z.string().optional(),
  observacoes: z.string().optional(),
  status: z.enum(['Previsto', 'Em Andamento', 'Concluído', 'Cancelado']).default('Previsto'),
  dia_semana: z.string().optional(),
  programacao_formatada: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Schema para Escolta
export const escoltaSchema = z.object({
  id: uuidSchema.optional(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
  certificacoes: z.string().optional(),
  status: z.enum(['Disponível', 'Ocupado', 'Inativo']).default('Disponível'),
  observacoes: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional(),
});

// Tipos TypeScript derivados dos schemas
export type Cliente = z.infer<typeof clienteSchema>;
export type Colaborador = z.infer<typeof colaboradorSchema>;
export type Veiculo = z.infer<typeof veiculoSchema>;
export type ItemEstoque = z.infer<typeof itemEstoqueSchema>;
export type Solicitacao = z.infer<typeof solicitacaoSchema>;
export type AjudaCusto = z.infer<typeof ajudaCustoSchema>;
export type Programacao = z.infer<typeof programacaoSchema>;
export type Escolta = z.infer<typeof escoltaSchema>;

// Schemas para criação (omitindo campos auto-gerados)
export const createClienteSchema = clienteSchema.omit({ id: true, created_at: true, updated_at: true });
export const createColaboradorSchema = colaboradorSchema.omit({ id: true, created_at: true, updated_at: true });
export const createVeiculoSchema = veiculoSchema.omit({ id: true, created_at: true, updated_at: true });
export const createItemEstoqueSchema = itemEstoqueSchema.omit({ id: true, created_at: true, updated_at: true });
export const createSolicitacaoSchema = solicitacaoSchema.omit({ id: true, created_at: true, updated_at: true });
export const createAjudaCustoSchema = ajudaCustoSchema.omit({ id: true, created_at: true, updated_at: true });
export const createProgramacaoSchema = programacaoSchema.omit({ id: true, created_at: true, updated_at: true, dia_semana: true, programacao_formatada: true });
export const createEscoltaSchema = escoltaSchema.omit({ id: true, created_at: true, updated_at: true });

// Schemas para atualização (todos os campos opcionais exceto id)
export const updateClienteSchema = createClienteSchema.partial();
export const updateColaboradorSchema = createColaboradorSchema.partial();
export const updateVeiculoSchema = createVeiculoSchema.partial();
export const updateItemEstoqueSchema = createItemEstoqueSchema.partial();
export const updateSolicitacaoSchema = createSolicitacaoSchema.partial();
export const updateAjudaCustoSchema = createAjudaCustoSchema.partial();
export const updateProgramacaoSchema = createProgramacaoSchema.partial();
export const updateEscoltaSchema = createEscoltaSchema.partial();

// Tipos para criação e atualização
export type CreateCliente = z.infer<typeof createClienteSchema>;
export type UpdateCliente = z.infer<typeof updateClienteSchema>;
export type CreateColaborador = z.infer<typeof createColaboradorSchema>;
export type UpdateColaborador = z.infer<typeof updateColaboradorSchema>;
export type CreateVeiculo = z.infer<typeof createVeiculoSchema>;
export type UpdateVeiculo = z.infer<typeof updateVeiculoSchema>;
export type CreateItemEstoque = z.infer<typeof createItemEstoqueSchema>;
export type UpdateItemEstoque = z.infer<typeof updateItemEstoqueSchema>;
export type CreateSolicitacao = z.infer<typeof createSolicitacaoSchema>;
export type UpdateSolicitacao = z.infer<typeof updateSolicitacaoSchema>;
export type CreateAjudaCusto = z.infer<typeof createAjudaCustoSchema>;
export type UpdateAjudaCusto = z.infer<typeof updateAjudaCustoSchema>;
export type CreateProgramacao = z.infer<typeof createProgramacaoSchema>;
export type UpdateProgramacao = z.infer<typeof updateProgramacaoSchema>;
export type CreateEscolta = z.infer<typeof createEscoltaSchema>;
export type UpdateEscolta = z.infer<typeof updateEscoltaSchema>;