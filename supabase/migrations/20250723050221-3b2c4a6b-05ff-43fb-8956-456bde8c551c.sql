-- Create programacoes table for appointment scheduling
CREATE TABLE public.programacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL,
  data_atendimento DATE NOT NULL,
  dia_semana TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Previsto' CHECK (status IN ('Previsto', 'Confirmado')),
  data_saida DATE NOT NULL,
  hora_saida TIME NOT NULL,
  local TEXT NOT NULL,
  tipo TEXT NOT NULL,
  equipe_ids UUID[] NOT NULL,
  motorista_id UUID,
  veiculo_id UUID,
  escolta_id UUID,
  hospedagem TEXT,
  observacoes TEXT,
  programacao_formatada TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cliente_id, data_atendimento)
);

-- Enable Row Level Security
ALTER TABLE public.programacoes ENABLE ROW LEVEL SECURITY;

-- Create policies for programacoes table
CREATE POLICY "Users can view all programacoes" 
ON public.programacoes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create programacoes" 
ON public.programacoes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update programacoes" 
ON public.programacoes 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete programacoes" 
ON public.programacoes 
FOR DELETE 
USING (true);

-- Create function to calculate day of week and generate formatted programming
CREATE OR REPLACE FUNCTION public.update_programacao_details()
RETURNS TRIGGER AS $$
DECLARE
  cliente_nome TEXT;
  motorista_nome TEXT;
  veiculo_info TEXT;
  escolta_info TEXT;
  equipe_nomes TEXT[];
  equipe_string TEXT;
BEGIN
  -- Calculate day of week in Portuguese
  NEW.dia_semana = CASE EXTRACT(DOW FROM NEW.data_atendimento)
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Segunda-feira'
    WHEN 2 THEN 'Terça-feira'
    WHEN 3 THEN 'Quarta-feira'
    WHEN 4 THEN 'Quinta-feira'
    WHEN 5 THEN 'Sexta-feira'
    WHEN 6 THEN 'Sábado'
  END;

  -- Get client name
  SELECT nome INTO cliente_nome FROM public.clientes WHERE id = NEW.cliente_id;
  
  -- Get driver name
  SELECT nome INTO motorista_nome FROM public.colaboradores WHERE id = NEW.motorista_id;
  
  -- Get vehicle info
  SELECT 
    CASE 
      WHEN tipo = 'UMB' THEN tipo || ' - ' || modelo
      WHEN tipo = 'BAU' THEN tipo || ' - ' || modelo  
      WHEN tipo = 'APOIO' THEN tipo || ' - ' || modelo
      ELSE modelo
    END 
  INTO veiculo_info 
  FROM public.frota 
  WHERE id = NEW.veiculo_id;
  
  -- Get escort info
  SELECT nome INTO escolta_info FROM public.escolta WHERE id = NEW.escolta_id;
  
  -- Get team names
  SELECT array_agg(nome) INTO equipe_nomes 
  FROM public.colaboradores 
  WHERE id = ANY(NEW.equipe_ids);
  
  -- Convert array to string
  SELECT string_agg(nome, ', ') INTO equipe_string 
  FROM unnest(equipe_nomes) AS nome;

  -- Generate formatted programming
  NEW.programacao_formatada = 
    'CLIENTE: ' || COALESCE(cliente_nome, '') || E'\n\n' ||
    'DATA ATENDIMENTO: ' || TO_CHAR(NEW.data_atendimento, 'DD/MM/YYYY') || E'\n' ||
    'DATA SAÍDA: ' || TO_CHAR(NEW.data_saida, 'DD/MM/YYYY') || ', ' || NEW.hora_saida || E'\n' ||
    'LOCAL: ' || COALESCE(NEW.local, '') || E'\n' ||
    'TECNICO: ' || COALESCE(motorista_nome, '') || E'\n' ||
    'EQUIPE: ' || COALESCE(equipe_string, '') || E'\n' ||
    'MOTORISTA: ' || COALESCE(motorista_nome, '') || E'\n' ||
    'UMB: ' || CASE WHEN veiculo_info LIKE 'UMB%' THEN veiculo_info ELSE '' END || E'\n' ||
    'BAÚ: ' || CASE WHEN veiculo_info LIKE 'BAU%' THEN veiculo_info ELSE '' END || E'\n' ||
    'APOIO: ' || CASE WHEN veiculo_info LIKE 'APOIO%' THEN veiculo_info ELSE '' END || E'\n' ||
    'ESCOLTA: ' || COALESCE(escolta_info, '') || E'\n' ||
    'HOSPEDAGEM: ' || COALESCE(NEW.hospedagem, '') || E'\n' ||
    'TIPO: ' || COALESCE(NEW.tipo, '') || E'\n\n' ||
    'OBS: ' || COALESCE(NEW.observacoes, '');

  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for programacoes
CREATE TRIGGER update_programacao_details_trigger
BEFORE INSERT OR UPDATE ON public.programacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_programacao_details();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates (only for updated_at, not the programacao details)
CREATE TRIGGER update_programacoes_updated_at
AFTER UPDATE ON public.programacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();