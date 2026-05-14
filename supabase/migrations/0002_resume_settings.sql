-- 补充 resumes 表：样式与区块配置字段
-- 请在 Supabase SQL Editor 执行

alter table public.resumes
  add column if not exists settings jsonb not null default '{}'::jsonb;