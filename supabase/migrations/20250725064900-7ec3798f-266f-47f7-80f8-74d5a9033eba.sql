-- Add missing fields to financial_entries table
ALTER TABLE public.financial_entries 
ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'dinheiro',
ADD COLUMN IF NOT EXISTS subcategory TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS observations TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS time TIME WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIME;

-- Create constraints for fixed categories
ALTER TABLE public.financial_entries 
ADD CONSTRAINT check_entry_type 
CHECK (type IN ('income', 'expense'));

ALTER TABLE public.financial_entries 
ADD CONSTRAINT check_payment_method 
CHECK (payment_method IN ('dinheiro', 'cartao', 'pix', 'transferencia', 'outros'));

-- Create constraints for categories based on type
ALTER TABLE public.financial_entries 
ADD CONSTRAINT check_income_categories 
CHECK (
  (type = 'income' AND category IN ('produto', 'servico', 'pacote')) OR
  (type = 'expense' AND category IN ('despesas_fixas', 'despesas_variaveis', 'despesas_pessoal', 'impostos', 'outras_despesas', 'reserva_financeira'))
);

-- Create constraints for subcategories based on category
ALTER TABLE public.financial_entries 
ADD CONSTRAINT check_subcategories 
CHECK (
  (category = 'produto' AND subcategory = 'produto') OR
  (category = 'servico' AND subcategory = 'servico') OR
  (category = 'pacote' AND subcategory = 'pacote') OR
  (category = 'despesas_fixas' AND subcategory IN ('aluguel', 'contador', 'internet', 'seguranca')) OR
  (category = 'despesas_variaveis' AND subcategory IN ('compra_produto', 'descartaveis', 'limpeza', 'luz', 'manutencao', 'papelaria', 'telefone', 'toalhas')) OR
  (category = 'despesas_pessoal' AND subcategory IN ('alimentacao', 'bonificacao', 'pagamento_profissional', 'pro_labore', 'passagem_vale_transporte', 'vale_adiantamento_profissional', 'investimento_treinamentos')) OR
  (category = 'impostos' AND subcategory IN ('imposto_municipal', 'imposto_estadual', 'imposto_federal')) OR
  (category = 'outras_despesas' AND LENGTH(subcategory) > 0) OR
  (category = 'reserva_financeira' AND LENGTH(subcategory) > 0)
);

-- Update existing records to have valid data
UPDATE public.financial_entries 
SET 
  payment_method = 'dinheiro',
  observations = COALESCE(description, 'Lançamento importado'),
  time = CURRENT_TIME,
  subcategory = CASE 
    WHEN type = 'income' THEN 'servico'
    ELSE 'outras_despesas'
  END,
  category = CASE 
    WHEN type = 'income' THEN 'servico'
    ELSE 'outras_despesas'
  END
WHERE payment_method IS NULL OR subcategory IS NULL OR observations IS NULL;