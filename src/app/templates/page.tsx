"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type CategoryId =
  | "all"
  | "it"
  | "finance"
  | "education"
  | "entry"
  | "creative";

type SortId = "popular" | "newest";

const categories: { id: CategoryId; name: string }[] = [
  { id: "all", name: "全部模板" },
  { id: "it", name: "IT/互联网" },
  { id: "finance", name: "金融/咨询" },
  { id: "education", name: "教育/科研" },
  { id: "entry", name: "应届生/实习" },
  { id: "creative", name: "设计/创意" },
];

const styleFilters = [
  { id: "single", label: "极简单栏" },
  { id: "double", label: "经典双栏" },
  { id: "creative", label: "创意图形" },
];

type Template = {
  id: number;
  title: string;
  category: CategoryId;
  usage: number;
  isNew: boolean;
  isPro: boolean;
  createdAt: number;
};

const titlePool = [
  "极简通用模板",
  "互联网大厂专用",
  "产品经理高端版",
  "应届生优选",
  "财务分析师专业版",
  "设计师创意流",
];

const categoryPool: CategoryId[] = [
  "it",
  "it",
  "it",
  "entry",
  "finance",
  "creative",
  "education",
  "it",
  "finance",
  "creative",
  "entry",
  "education",
];

const templates: Template[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: titlePool[i % titlePool.length],
  category: categoryPool[i] ?? "all",
  usage: 1200 + i * 340,
  isNew: i === 1 || i === 4 || i === 9,
  isPro: i === 2 || i === 5 || i === 11,
  createdAt: 1_700_000_000 - i * 86_400,
}));

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function TemplateCenterPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [activeSort, setActiveSort] = useState<SortId>("popular");
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filteredTemplates = useMemo(() => {
    const list =
      activeCategory === "all"
        ? [...templates]
        : templates.filter((t) => t.category === activeCategory);

    if (activeSort === "popular") {
      list.sort((a, b) => b.usage - a.usage);
    } else {
      list.sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [activeCategory, activeSort]);

  const toggleStyle = (id: string) => {
    setActiveStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 shrink-0">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 tracking-wider cursor-pointer"
            >
              Fre简历
            </Link>
            <div className="flex gap-6 text-[15px] font-medium text-gray-600">
              <Link
                href="/"
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                首页
              </Link>
              <span className="text-blue-600 cursor-pointer">模板中心</span>
              <Link
                href="/me"
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                我的简历
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[14px] text-gray-500 hover:text-gray-800 font-medium">
              登录
            </button>
            <button className="px-5 py-2 bg-blue-600 text-white text-[14px] font-medium rounded-full hover:bg-blue-700 transition-colors">
              免费注册
            </button>
          </div>
        </div>
      </nav>

      {/* Page header */}
      <section className="bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-12 py-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            模板中心
          </h1>
          <p className="text-gray-500 text-[15px]">
            128+ 款精美简历模板，覆盖各行各业，助你一键打造高品质简历
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-12 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              按岗位分类
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-[14px] transition-colors ${
                    activeCategory === cat.id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4 mt-8">
              排版风格
            </h2>
            <div className="flex flex-col gap-2">
              {styleFilters.map((style) => (
                <label
                  key={style.id}
                  className="flex items-center gap-3 px-2 py-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeStyles.includes(style.id)}
                    onChange={() => toggleStyle(style.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 text-[14px]">
                    {style.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Template List */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-600 text-[14px]">
              共为您找到{" "}
              <span className="text-blue-600 font-bold">
                {filteredTemplates.length}
              </span>{" "}
              款精美模板
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSort("popular")}
                className={`px-4 py-1.5 rounded-full text-[13px] transition-colors ${
                  activeSort === "popular"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                最热
              </button>
              <button
                type="button"
                onClick={() => setActiveSort("newest")}
                className={`px-4 py-1.5 rounded-full text-[13px] transition-colors ${
                  activeSort === "newest"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                最新
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((tpl) => {
              const fav = favorites.has(tpl.id);
              return (
                <div key={tpl.id} className="group flex flex-col">
                  <div className="aspect-[1/1.4] rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100 group-hover:shadow-xl transition-all relative cursor-pointer mb-3">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      {tpl.isPro && (
                        <span className="bg-amber-500 text-white text-[12px] px-2 py-0.5 rounded font-medium shadow-sm">
                          PRO
                        </span>
                      )}
                      {tpl.isNew && (
                        <span className="bg-rose-500 text-white text-[12px] px-2 py-0.5 rounded font-medium shadow-sm">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-20">
                      <Link
                        href="/editor"
                        className="w-32 py-2 bg-blue-600 text-white rounded-full text-[14px] font-medium hover:bg-blue-700 transition-colors text-center"
                      >
                        立即使用
                      </Link>
                      <button
                        type="button"
                        className="w-32 py-2 bg-white/20 text-white rounded-full text-[14px] font-medium border border-white/40 hover:bg-white/30 transition-colors"
                      >
                        查看大图
                      </button>
                    </div>

                    <Image
                      src={`https://l-api.jd.com/relay-aigc/design/image/prompt/A highly professional A4 size resume template design preview clean minimalist modern UI style white background?width=512&height=720&seed=${
                        tpl.id + 10
                      }`}
                      alt="模板封面"
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  <div className="px-1">
                    <h3 className="font-medium text-gray-800 text-[15px] mb-1 truncate">
                      {tpl.title}
                    </h3>
                    <div className="flex items-center justify-between text-[12px] text-gray-500">
                      <span>{tpl.usage.toLocaleString()} 人使用</span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(tpl.id)}
                        className={`transition-colors ${
                          fav
                            ? "text-rose-500"
                            : "hover:text-rose-500"
                        }`}
                        aria-label="收藏"
                      >
                        <HeartIcon />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-800 rounded"
                aria-label="上一页"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-white bg-blue-600 rounded font-medium text-[14px]"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded font-medium text-[14px]"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded font-medium text-[14px]"
              >
                3
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-gray-400">
                ...
              </span>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded font-medium text-[14px]"
              >
                10
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-800 rounded"
                aria-label="下一页"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}