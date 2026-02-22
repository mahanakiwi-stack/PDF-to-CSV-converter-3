-- Drop existing policies on usage_logs
DROP POLICY IF EXISTS "usage_logs_select_own" ON public.usage_logs;
DROP POLICY IF EXISTS "usage_logs_insert_own" ON public.usage_logs;

-- Disable RLS temporarily to allow inserts from API
ALTER TABLE public.usage_logs DISABLE ROW LEVEL SECURITY;
