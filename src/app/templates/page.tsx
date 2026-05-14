"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TemplatePreview from "@/components/templates/TemplatePreview";
import { templateMetaList } from "@/components/templates";
import type { TemplateId } from "@/types/resume";

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

/**
 * 模板列表项扩展信息：与 `templateMetaList` 中的真实模板 1:1 对应，
 * 不再使用 mock 占位图。新增 category / 使用人数 / 标签等元信息用于筛选展示。
 */
interface TemplateCard {
  id: TemplateId;
  name: string;
  description: string;
  category: Exclude<CategoryId, "all">;
  style: "single" | "double" | "creative";
  usage: number;
  isNew: boolean;
  isPro: boolean;
  createdAt: number;
}

const templateExtras: Record<TemplateId, Omit<TemplateCard, "id" | "name" | "description">> = {
  classic: {
    category: "it",
    style: "single",
    usage: 4280,
    isNew: false,
    isPro: false,
    createdAt: 1_700_000_000,
  },
  modern: {
    category: "creative",
    style: "double",
    usage: 3120,
    isNew: false,
    isPro: true,
    createdAt: 1_700_500_000,
  },
  minimal: {
    category: "entry",
    style: "single",
    usage: 5670,
    isNew: true,
    isPro: false,
    createdAt: 1_701_000_000,
  },
};

function buildTemplateCards(): TemplateCard[] {
  return templateMetaList.map((meta) => ({
    id: meta.id,
    name: meta.name,
    description: meta.description,
    ...templateExtras[meta.id],
  }));
}

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

export default function TemplateCenterPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [activeSort, setActiveSort] = useState<SortId>("popular");
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<TemplateId>>(new Set());

  const allCards = useMemo(() => buildTemplateCards(), []);

  const filteredTemplates = useMemo(() => {
    let list = allCards;

    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (activeStyles.length > 0) {
      list = list.filter((t) => activeStyles.includes(t.style));
    }

    list = [...list];
    if (activeSort === "popular") {
      list.sort((a, b) => b.usage - a.usage);
    } else {
      list.sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [allCards, activeCategory, activeSort, activeStyles]);

  const toggleStyle = (id: string) => {
    setActiveStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (id: TemplateId) => {
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
            精挑细选的简历模板，所见即所得，点击立即使用进入编辑器
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        href={`/editor?template=${tpl.id}`}
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

                    {/* Real preview */}
                    <TemplatePreview templateId={tpl.id} />
                  </div>

                  <div className="px-1">
                    <h3 className="font-medium text-gray-800 text-[15px] mb-1 truncate">
                      {tpl.name}
                    </h3>
                    <p className="text-[12px] text-gray-500 mb-2 line-clamp-1">
                      {tpl.description}
                    </p>
                    <div className="flex items-center justify-between text-[12px] text-gray-500">
                      <span>{tpl.usage.toLocaleString()} 人使用</span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(tpl.id)}
                        className={`transition-colors ${
                          fav ? "text-rose-500" : "hover:text-rose-500"
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

          {filteredTemplates.length === 0 && (
            <div className="mt-12 text-center text-gray-500 text-sm">
              暂无符合条件的模板，调整筛选条件试试。
            </div>
          )}
        </div>
      </main>
    </div>
  );
}