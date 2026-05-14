"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { defaultSections, type SectionKey } from "@/types/resume";
import ContentForm from "./ContentForm";

const SECTION_LABELS: Record<SectionKey, { label: string; icon: string }> = {
  basics: { label: "基本信息", icon: "👤" },
  summary: { label: "个人简介", icon: "📝" },
  work: { label: "工作经历", icon: "💼" },
  education: { label: "教育背景", icon: "🎓" },
  projects: { label: "项目经历", icon: "🚀" },
  skills: { label: "专业技能", icon: "🛠️" },
  awards: { label: "荣誉奖项", icon: "🏆" },
};

/**
 * 左侧栏：手风琴式区块列表
 * - 点击标题折叠/展开，内嵌对应表单
 * - 每行右侧带 iOS 风格显隐开关，控制预览是否渲染该区块
 */
export default function SectionsPanel() {
  const sections = useEditorStore(
    (s) => s.content.sections ?? defaultSections
  );
  const toggleSection = useEditorStore((s) => s.toggleSection);

  // 默认展开第一个区块（基本信息）
  const [openSet, setOpenSet] = useState<Set<SectionKey>>(
    new Set([sections[0]?.key ?? "basics"])
  );

  const toggleOpen = (key: SectionKey) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          简历区块
        </h3>
      </div>

      <ul className="p-2 space-y-1.5">
        {sections.map((sec) => {
          const meta = SECTION_LABELS[sec.key];
          const isOpen = openSet.has(sec.key);
          return (
            <li
              key={sec.key}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* 标题栏 */}
              <div
                className={`flex items-center px-3 py-2.5 cursor-pointer transition-colors select-none ${
                  isOpen ? "bg-blue-50/50" : "hover:bg-gray-50"
                } ${!sec.visible ? "opacity-60" : ""}`}
                onClick={() => toggleOpen(sec.key)}
              >
                <span className="mr-2 text-base">{meta.icon}</span>
                <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                  {meta.label}
                </span>

                {/* iOS 风显隐开关 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(sec.key);
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors mr-2 ${
                    sec.visible ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={sec.visible}
                  title={sec.visible ? "已显示，点击隐藏" : "已隐藏，点击显示"}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sec.visible ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>

                {/* 展开箭头 */}
                <span
                  className={`text-gray-400 text-xs transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {/* 内嵌表单 */}
              {isOpen && (
                <div className="border-t border-gray-100 p-3 bg-gray-50/30">
                  <ContentForm sectionKey={sec.key} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}