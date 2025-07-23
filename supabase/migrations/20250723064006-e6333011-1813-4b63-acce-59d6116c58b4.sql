-- Criar tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cnpj_cpf TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  contato_responsavel TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de colaboradores
CREATE TABLE public.colaboradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  telefone TEXT,
  cpf TEXT UNIQUE,
  cargo TEXT,
  departamento TEXT,
  data_admissao DATE,
  salario DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'Ativo',
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de frota
CREATE TABLE public.frota (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modelo TEXT NOT NULL,
  marca TEXT NOT NULL,
  ano INTEGER,
  placa TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL, -- UMB, BAU, APOIO
  capacidade TEXT,
  status TEXT NOT NULL DEFAULT 'Disponível',
  quilometragem INTEGER DEFAULT 0,
  data_aquisicao DATE,
  valor_aquisicao DECIMAL(12,2),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de escolta
CREATE TABLE public.escolta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  empresa TEXT,
  certificacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Disponível',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estoque
CREATE TABLE public.estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  subcategoria TEXT,
  codigo_interno TEXT UNIQUE,
  quantidade_atual INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER DEFAULT 0,
  quantidade_maxima INTEGER,
  unidade_medida TEXT NOT NULL DEFAULT 'UN',
  valor_unitario DECIMAL(10,2),
  fornecedor TEXT,
  localizacao TEXT,
  data_validade DATE,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de solicitações
CREATE TABLE public.solicitacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL, -- material, veículo, serviço
  solicitante_id UUID,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  prioridade TEXT NOT NULL DEFAULT 'Média',
  status TEXT NOT NULL DEFAULT 'Pendente',
  data_necessidade DATE,
  observacoes TEXT,
  aprovado_por UUID,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de ajudas de custo
CREATE TABLE public.ajudas_custo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID,
  cliente_id UUID,
  tipo TEXT NOT NULL, -- hospedagem, alimentação, transporte, outros
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_gasto DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  comprovante_url TEXT,
  observacoes TEXT,
  aprovado_por UUID,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frota ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escolta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ajudas_custo ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (temporariamente permissivas - serão refinadas na Fase 2)
CREATE POLICY "Permitir todas as operações" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas as operações" ON public.colaboradores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas as operações" ON public.frota FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas as operações" ON public.escolta FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas as operações" ON public.estoque FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas as operações" ON public.solicitacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todas as operações" ON public.ajudas_custo FOR ALL USING (true) WITH CHECK (true);

-- Criar triggers para updated_at
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_colaboradores_updated_at
  BEFORE UPDATE ON public.colaboradores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_frota_updated_at
  BEFORE UPDATE ON public.frota
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_escolta_updated_at
  BEFORE UPDATE ON public.escolta
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estoque_updated_at
  BEFORE UPDATE ON public.estoque
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solicitacoes_updated_at
  BEFORE UPDATE ON public.solicitacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ajudas_custo_updated_at
  BEFORE UPDATE ON public.ajudas_custo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();