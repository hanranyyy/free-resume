-- 在 Supabase 控制台 -> SQL Editor 中粘贴并执行此文件
-- 创建 resumes 表用于保存简历内容

create extension if not exists "uuid-ossp";

create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  title text not null default '未命名简历',
  template_id text not null default 'classic',
  content jsonb not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 自动更新 updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_resumes_updated_at on public.resumes;
create trigger trg_resumes_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

-- 索引：常用查询路径
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_updated_at on public.resumes(updated_at desc);

-- 行级安全策略（RLS）
-- 当前演示阶段后端使用 service-role key 绕过 RLS。
-- 若后续接入 Supabase Auth，请打开下面策略：
-- alter table public.resumes enable row level security;
-- create policy "owner can read"   on public.resumes for select using (auth.uid() = user_id);
-- create policy "owner can write"  on public.resumes for insert with check (auth.uid() = user_id);
-- create policy "owner can update" on public.resumes for update using (auth.uid() = user_id);
-- create policy "owner can delete" on public.resumes for delete using (auth.uid() = user_id);