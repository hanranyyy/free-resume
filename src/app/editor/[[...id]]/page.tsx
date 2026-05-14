"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SectionsPanel from "@/components/editor/SectionsPanel";
import PreviewCanvas from "@/components/editor/PreviewCanvas";
import StylePanel from "@/components/editor/StylePanel";
import ResizableLayout from "@/components/editor/ResizableLayout";
import { resumeApi } from "@/lib/api";
import { useAutoSave } from "@/lib/editor/useAutoSave";
import {
  useEditorStore,
  useEditorTemporal,
  type SaveState,
} from "@/lib/editor/store";
import { defaultSections } from "@/types/resume";
import { sampleResume } from "@/data/sampleResume";

export default function EditorPage() {
  const params = useParams<{ id?: string[] }>();
  const resumeId = params?.id?.[0] ?? null;
  const router = useRouter();

  const hydrate = useEditorStore((s) => s.hydrate);
  const title = useEditorStore((s) => s.title);
  const setMeta = useEditorStore((s) => s.setMeta);
  const saveState = useEditorStore((s) => s.saveState);
  const errorMsg = useEditorStore((s) => s.errorMsg);
  const id = useEditorStore((s) => s.id);
  const save = useEditorStore((s) => s.save);

  const [loading, setLoading] = useState(true);

  // 初始化：拉取或开新简历
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (resumeId) {
        try {
          const row = await resumeApi.get(resumeId);
          if (!mounted) return;
          hydrate({
            id: row.id,
            title: row.title,
            templateId: row.template_id,
            content: row.content,
            settings: row.settings ?? {},
          });
        } catch (e) {
          console.error("加载简历失败", e);
        }
      } else {
        // 新建模式：填充前端开发示例数据，方便用户直接看到效果与编辑
        hydrate({
          id: null,
          title: "前端工程师 - 张三",
          templateId: "classic",
          content: {
            ...sampleResume,
            sections: defaultSections,
          },
          settings: {},
        });
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [resumeId, hydrate]);

  // 自动保存（加载完成后启用）
  useAutoSave(!loading);

  // 首次创建后，URL 同步到 /editor/<新 id>
  useEffect(() => {
    if (id && !resumeId) {
      router.replace(`/editor/${id}`);
    }
  }, [id, resumeId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/templates" className="text-sm text-blue-600 shrink-0">
            ← 返回
          </Link>
          <input
            value={title}
            onChange={(e) => setMeta({ title: e.target.value })}
            className="px-2 py-1 text-sm border border-transparent hover:border-gray-200 focus:border-blue-500 rounded focus:outline-none w-[240px]"
            placeholder="简历标题"
          />
        </div>

        <UndoRedoButtons />

        <div className="flex items-center gap-2">
          <SaveBadge state={saveState} />
          <button
            type="button"
            onClick={save}
            disabled={saveState === "saving"}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saveState === "saving" ? "保存中..." : "保存"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
          >
            导出 PDF
          </button>
        </div>
      </header>

      {errorMsg && (
        <div className="px-4 py-1.5 bg-red-50 text-red-600 text-xs">{errorMsg}</div>
      )}

      {/* Three-column layout：左右栏宽度可拖拽调整 */}
      <ResizableLayout
        storageKey="editor-layout"
        left={<SectionsPanel />}
        middle={<PreviewCanvas />}
        right={<StylePanel />}
      />
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state === "saving") return <span className="text-xs text-gray-400">保存中...</span>;
  if (state === "saved") return <span className="text-xs text-green-600">✓ 已保存</span>;
  if (state === "error") return <span className="text-xs text-red-500">保存失败</span>;
  return null;
}

function UndoRedoButtons() {
  const [, forceUpdate] = useState(0);
  const temporal = useEditorTemporal();

  // 监听历史变化，更新按钮 disabled 状态
  useEffect(() => {
    const unsub = useEditorStore.temporal.subscribe(() => forceUpdate((v) => v + 1));
    return () => unsub();
  }, []);

  // 快捷键
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.temporal.getState().undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        useEditorStore.temporal.getState().redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const canUndo = temporal.pastStates.length > 0;
  const canRedo = temporal.futureStates.length > 0;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => useEditorStore.temporal.getState().undo()}
        disabled={!canUndo}
        className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        title="撤销 (⌘Z)"
      >
        ↶ 撤销
      </button>
      <button
        type="button"
        onClick={() => useEditorStore.temporal.getState().redo()}
        disabled={!canRedo}
        className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        title="重做 (⇧⌘Z)"
      >
        ↷ 重做
      </button>
    </div>
  );
}