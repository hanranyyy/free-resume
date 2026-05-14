"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { resumeApi } from "@/lib/api";
import type { ResumeRow } from "@/types/db";

type TabId = "resumes" | "favorites" | "settings";

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

export default function UserCenterPage() {
  const [activeTab, setActiveTab] = useState<TabId>("resumes");
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await resumeApi.list();
        if (!mounted) return;
        setResumes(list);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(e instanceof Error ? e.message : "加载失败");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("确认删除该简历？此操作无法撤销")) return;
    try {
      await resumeApi.remove(id);
      setResumes((list) => list.filter((r) => r.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shrink-0">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 py-4">
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
              <Link
                href="/templates"
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                模板中心
              </Link>
              <span className="text-blue-600 cursor-pointer">我的简历</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[14px]">
              Z
            </div>
            <span className="text-gray-700 font-medium text-[14px]">张三</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("resumes")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] transition-colors ${
                activeTab === "resumes"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileIcon /> 我的简历
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] transition-colors ${
                activeTab === "favorites"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <StarIcon /> 模板收藏
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <UserIcon /> 账号设置
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-w-0">
          {activeTab === "resumes" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">我的简历</h2>
                <Link
                  href="/templates"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon /> 新建简历
                </Link>
              </div>

              {errorMsg && (
                <div className="mb-6 px-4 py-2 bg-red-50 text-red-600 text-sm rounded">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New Card */}
                <Link
                  href="/templates"
                  className="aspect-[1/1.4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">从模板创建</span>
                </Link>

                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-white animate-pulse"
                      >
                        <div className="aspect-[1/1.4] bg-gray-100" />
                        <div className="p-4">
                          <div className="h-4 bg-gray-100 rounded mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                        </div>
                      </div>
                    ))
                  : resumes.map((resume, idx) => (
                      <div
                        key={resume.id}
                        className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col bg-white"
                      >
                        <div className="aspect-[1/1.4] bg-gray-100 relative overflow-hidden">
                          <Image
                            src={`https://l-api.jd.com/relay-aigc/design/image/prompt/A highly professional A4 size resume template design preview clean minimalist modern UI style white background?width=512&height=720&seed=${
                              idx + 1
                            }`}
                            alt="封面"
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover"
                            unoptimized
                          />
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-10">
                            <Link
                              href={`/editor/${resume.id}`}
                              className="w-32 py-2 bg-blue-600 text-white rounded-full text-[14px] font-medium hover:bg-blue-700 transition-colors text-center"
                            >
                              继续编辑
                            </Link>
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="w-32 py-2 bg-white/20 text-white rounded-full text-[14px] font-medium border border-white/40 hover:bg-white/30 transition-colors"
                            >
                              下载 PDF
                            </button>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3
                            className="font-medium text-gray-900 text-[15px] mb-1 truncate"
                            title={resume.title}
                          >
                            {resume.title}
                          </h3>
                          <p className="text-[12px] text-gray-500 mb-3">
                            更新于 {formatDate(resume.updated_at)}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 text-gray-500">
                            <button
                              type="button"
                              className="hover:text-blue-600 transition-colors px-2"
                              title="重命名"
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              className="hover:text-blue-600 transition-colors px-2"
                              title="复制"
                            >
                              <CopyIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(resume.id)}
                              className="hover:text-red-600 transition-colors px-2"
                              title="删除"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              {!loading && resumes.length === 0 && (
                <div className="mt-10 text-center text-gray-500 text-sm">
                  还没有保存的简历，从右上角"新建简历"开始吧。
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="text-center text-gray-500 mt-20">
              <StarIcon className="w-10 h-10 mx-auto mb-4 text-gray-300" />
              <p>暂无收藏的模板</p>
              <Link
                href="/templates"
                className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                去模板中心看看
              </Link>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">账号设置</h2>
              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("设置已保存（演示）");
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    头像
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                      Z
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      修改头像
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    defaultValue="张三"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    绑定手机
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue="138****1234"
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors"
                >
                  保存修改
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}