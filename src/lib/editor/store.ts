import { create } from "zustand";
import { temporal } from "zundo";
import { resumeApi } from "@/lib/api";
import {
  defaultResumeStyle,
  defaultSections,
  type Resume,
  type ResumeStyle,
  type SectionConfig,
  type SectionKey,
  type TemplateId,
} from "@/types/resume";
import type { ResumeSettings } from "@/types/db";

export type SaveState = "idle" | "saving" | "saved" | "error";

interface EditorState {
  // 元信息
  id: string | null;
  title: string;
  templateId: TemplateId;

  // 内容（受撤销/重做管理）
  content: Resume;
  style: ResumeStyle;

  // UI 状态
  saveState: SaveState;
  errorMsg: string | null;

  // setters
  setMeta: (patch: Partial<Pick<EditorState, "id" | "title" | "templateId">>) => void;
  setContent: (updater: (prev: Resume) => Resume) => void;
  setStyle: (patch: Partial<ResumeStyle>) => void;
  toggleSection: (key: SectionKey) => void;
  hydrate: (payload: {
    id: string | null;
    title: string;
    templateId: TemplateId;
    content: Resume;
    settings: ResumeSettings;
  }) => void;

  // 远端
  save: () => Promise<void>;
  setSaveState: (s: SaveState) => void;
  setError: (msg: string | null) => void;
}

const emptyContent: Resume = {
  basics: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
  },
  work: [],
  education: [],
  projects: [],
  skills: [],
  awards: [],
  sections: defaultSections,
};

export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => ({
      id: null,
      title: "未命名简历",
      templateId: "classic",
      content: emptyContent,
      style: defaultResumeStyle,
      saveState: "idle",
      errorMsg: null,

      setMeta: (patch) => set(patch),

      setContent: (updater) =>
        set((s) => ({ content: updater(s.content) })),

      setStyle: (patch) =>
        set((s) => ({ style: { ...s.style, ...patch } })),

      toggleSection: (key) =>
        set((s) => {
          const sections = s.content.sections ?? defaultSections;
          return {
            content: {
              ...s.content,
              sections: sections.map((sec) =>
                sec.key === key ? { ...sec, visible: !sec.visible } : sec
              ),
            },
          };
        }),

      hydrate: ({ id, title, templateId, content, settings }) =>
        set({
          id,
          title,
          templateId,
          content: {
            ...content,
            sections: content.sections ?? defaultSections,
          },
          style: { ...defaultResumeStyle, ...(settings.style ?? {}) },
          saveState: "idle",
          errorMsg: null,
        }),

      setSaveState: (s) => set({ saveState: s }),
      setError: (msg) => set({ errorMsg: msg }),

      save: async () => {
        const { id, title, templateId, content, style } = get();
        set({ saveState: "saving", errorMsg: null });
        try {
          const settings: ResumeSettings = { style };
          if (id) {
            await resumeApi.update(id, {
              title,
              template_id: templateId,
              content,
              settings,
            });
          } else {
            const created = await resumeApi.create({
              title,
              template_id: templateId,
              content,
              settings,
            });
            set({ id: created.id });
          }
          set({ saveState: "saved" });
          setTimeout(() => {
            if (get().saveState === "saved") set({ saveState: "idle" });
          }, 2000);
        } catch (e) {
          set({
            saveState: "error",
            errorMsg: e instanceof Error ? e.message : "保存失败",
          });
        }
      },
    }),
    {
      // 仅追踪内容与样式相关，避免 saveState/errorMsg 等 UI 噪声进入历史栈
      partialize: (state) => ({
        title: state.title,
        templateId: state.templateId,
        content: state.content,
        style: state.style,
      }),
      limit: 100,
      // 200ms 内的连续修改合并为一次（输入字符不会爆栈）
      handleSet: (handleSet) => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        return (state) => {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            handleSet(state);
            timer = null;
          }, 200);
        };
      },
    }
  )
);

/** 取得 zundo 的 undo/redo API */
export const useEditorTemporal = () => useEditorStore.temporal.getState();