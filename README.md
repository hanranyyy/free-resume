# Next.js + TypeScript 启动模板

一个开箱即用的 Next.js 14 + TypeScript 启动模板，集成 App Router、Tailwind CSS 和 ESLint。

## ✨ 特性

- ⚡ **Next.js 14** — 基于 App Router 的现代化 React 框架
- 🔷 **TypeScript** — 严格模式开启，类型安全
- 🎨 **Tailwind CSS** — 原子化 CSS 框架
- 🧹 **ESLint** — 代码风格与质量检查
- 🧩 **API Routes** — 内置示例 `/api/hello`
- 🌙 **深色模式** — 基于 `prefers-color-scheme` 自适应
- 📁 **路径别名** — 使用 `@/*` 映射到 `src/*`

## 🚀 快速开始

### 1. 配置 Supabase

1. 注册并创建 [Supabase](https://supabase.com) 项目
2. 在 SQL Editor 中执行 [`supabase/migrations/0001_init_resumes.sql`](supabase/migrations/0001_init_resumes.sql) 建表
3. 复制 `.env.example` 为 `.env.local`，填入：
   - `NEXT_PUBLIC_SUPABASE_URL` — 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key（**仅服务端使用**）

> 都能在 Project Settings → API 中找到。

### 2. 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
npm run build
npm run start
```

## 📂 目录结构

```
.
├── src/
│   └── app/
│       ├── api/hello/route.ts  # API 路由示例
│       ├── globals.css          # 全局样式
│       ├── layout.tsx           # 根布局
│       └── page.tsx             # 首页
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🌐 API 接口（Next.js Route Handlers + Supabase）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/resumes` | 获取所有简历列表 |
| POST | `/api/resumes` | 创建一份新简历 |
| GET | `/api/resumes/:id` | 获取单份简历详情 |
| PATCH | `/api/resumes/:id` | 局部更新简历 |
| DELETE | `/api/resumes/:id` | 删除简历 |

请求/响应统一约定：成功 `{ "data": T }`，失败 `{ "error": "..." }`。

前端调用：

```ts
import { resumeApi } from "@/lib/api";
const list = await resumeApi.list();
const created = await resumeApi.create({ content });
await resumeApi.update(id, { title });
await resumeApi.remove(id);
```

## 📜 可用脚本

- `npm run dev` — 启动开发服务器
- `npm run build` — 构建生产版本
- `npm run start` — 运行生产服务器
- `npm run lint` — 代码检查
- `npm run type-check` — TypeScript 类型检查