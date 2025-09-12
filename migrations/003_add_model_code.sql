-- Add model_code column to jobs table for model isolation
ALTER TABLE jobs 
ADD COLUMN model_code TEXT;

-- Create index on model_code for efficient model-scoped queries
CREATE INDEX IF NOT EXISTS idx_jobs_model_code ON jobs(model_code);

-- Create composite index for model + status queries
CREATE INDEX IF NOT EXISTS idx_jobs_model_status ON jobs(model_code, status);
