-- Add provider columns to jobs table
ALTER TABLE jobs 
ADD COLUMN provider TEXT,
ADD COLUMN provider_job_id TEXT;

-- Create index on provider_job_id for efficient lookups
CREATE INDEX IF NOT EXISTS idx_jobs_provider_job_id ON jobs(provider_job_id) WHERE provider_job_id IS NOT NULL;

-- Create index on status + provider for efficient polling queries
CREATE INDEX IF NOT EXISTS idx_jobs_status_provider ON jobs(status, provider) WHERE status = 'running';
