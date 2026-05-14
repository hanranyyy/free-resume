"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { sampleResume } from "@/data/sampleResume";
import {
  templateRegistry,
  templateMetaList,
} from "@/components/templates";
import { resumeApi } from "@/lib/api";
import type { Resume, TemplateId } from "@/types/resume";
import type { ResumeRow } from "@/types/db";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function TemplatesPage() {
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [content, setContent] = useState<Resume>(sampleResume);
  const [title, setTitle] = useState("我的简历");

  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 初始加载：拉取列表
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await resumeApi.list();
        if (!mounted) return;
        setResumes(list);
        if (list.length > 0) {
          const first = list[0];
          setActiveId(first.id);
          setTemplateId(first.template_id);
          setContent(first.content);
          setTitle(first.title);
        }
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : "加载失败");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const ActiveTemplate = templateRegistry[templateId];

  // 选择已有简历
  const handleSelectResume = useCallback((row: ResumeRow) => {
    setActiveId(row.id);
    setTemplateId(row.template_id);
    setContent(row.content);
    setTitle(row.title);
    setSaveState("idle");
  }, []);

  // 新建一份草稿（仅前端，未保存）
  const handleNewDraft = useCallback(() => {
    setActiveId(null);
    setTemplateId("classic");
    setContent(sampleResume);
    setTitle("我的简历");
    setSaveState("idle");
  }, []);

  // 保存（创建或更新）
  const handleSave = useCallback(async () => {
    setSaveState("saving");
    setErrorMsg(null);
    try {
      if (activeId) {
        const updated = await resumeApi.update(activeId, {
          title,
          template_id: templateId,
          content,
        });
        setResumes((list) =>
          list.map((r) => (r.id === updated.id ? updated : r))
        );
      } else {
        const created = await resumeApi.create({
          title,
          template_id: templateId,
          content,
        });
        setResumes((list) => [created, ...list]);
        setActiveId(created.id);
      }
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "保存失败");
      setSaveState("error");
    }
  }, [activeId, content, templateId, title]);

  // 删除
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("确认删除该简历？此操作无法撤销")) return;
    try {
      await resumeApi.remove(id);
      setResumes((list) => list.filter((r) => r.id !== id));
      if (activeId === id) {
        handleNewDraft();
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    }
  }, [activeId, handleNewDraft]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-8 py-4 gap-3">
          <Link href="/" className="text-xl font-bold text-blue-600 shrink-0">
            ← Fre简历
          </Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 max-w-[320px] px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="给简历起个名字"
          />
          <div className="flex items-center gap-2">
            <SaveBadge state={saveState} />
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              {saveState === "saving" ? "保存中..." : "保存"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-full hover:bg-gray-900"
            >
              导出 PDF
            </button>
          </div>
        </div>
      </header>

      {errorMsg && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 mt-3">
          <div className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded">
            {errorMsg}
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4 lg:sticky lg:top-[80px] lg:self-start">
          {/* 我的简历 */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">我的简历</h2>
              <button
                type="button"
                onClick={handleNewDraft}
                className="text-xs text-blue-600 hover:underline"
              >
                + 新建
              </button>
            </div>
            {loading ? (
              <p className="text-xs text-gray-400">加载中…</p>
            ) : resumes.length === 0 ? (
              <p className="text-xs text-gray-400">还没有保存的简历</p>
            ) : (
              <ul className="space-y-1">
                {resumes.map((r) => {
                  const active = r.id === activeId;
                  return (
                    <li
                      key={r.id}
                      className={`group flex items-center justify-between px-2 py-1.5 rounded text-[13px] cursor-pointer ${
                        active ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectResume(r)}
                    >
                      <span className="truncate flex-1">{r.title}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(r.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-xs text-red-500 ml-2"
                        aria-label="删除"
                      >
                        删除
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 模板选择 */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">
              选择模板（{templateMetaList.length}）
            </h2>
            {templateMetaList.map((tpl) => {
              const isActive = tpl.id === templateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateId(tpl.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    isActive
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-bold text-gray-900 text-sm">{tpl.name}</div>
                  <p className="text-[12px] text-gray-500 mt-1">
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="bg-gray-100 p-4 sm:p-8 rounded-xl shadow-sm overflow-auto">
          <div
            className="mx-auto bg-white shadow-md overflow-hidden print:shadow-none"
            style={{
              width: "210mm",
              minHeight: "297mm",
              ["--resume-padding" as string]: "16mm",
              ["--resume-primary" as string]: "#2563eb",
            }}
          >
            <ActiveTemplate resume={content} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state === "saved") return <span className="text-xs text-green-600">✓ 已保存</span>;
  if (state === "error") return <span className="text-xs text-red-500">保存失败</span>;
  return null;
}