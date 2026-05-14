"use client";

import { useMemo } from "react";
import { templateRegistry } from "@/components/templates";
import { useEditorStore } from "@/lib/editor/store";
import {
  defaultSections,
  type ResumeStyle,
  type SectionKey,
} from "@/types/resume";

const FONT_FAMILY_MAP: Record<ResumeStyle["fontFamily"], string> = {
  sans: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  serif: 'Georgia, "Songti SC", "STSong", serif',
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
};

/**
 * 预览画布：充当 A4 纸张容器（210×297mm + 阴影 + 字体环境）。
 * 模板组件直接在内部铺开内容，不再额外加白底/阴影/aspect-ratio 等包裹层。
 * pageMargin 通过 CSS 变量 --resume-padding 传给模板，由模板按需消费（如分栏模板可以忽略）。
 */
export default function PreviewCanvas() {
  const templateId = useEditorStore((s) => s.templateId);
  const content = useEditorStore((s) => s.content);
  const style = useEditorStore((s) => s.style);

  const Template = templateRegistry[templateId];

  const visibleSet = useMemo<Set<SectionKey>>(() => {
    const sections = content.sections ?? defaultSections;
    return new Set(sections.filter((s) => s.visible).map((s) => s.key));
  }, [content.sections]);

  return (
    <div className="h-full overflow-auto bg-gray-200 py-6 px-4">
      <div
        className="mx-auto bg-white shadow-2xl overflow-hidden"
        style={{
          width: "210mm",
          minHeight: "297mm",
          fontFamily: FONT_FAMILY_MAP[style.fontFamily],
          fontSize: `${style.fontSize}px`,
          lineHeight: style.lineHeight,
          color: "#1f2937",
          ["--resume-primary" as string]: style.primaryColor,
          ["--resume-padding" as string]: `${style.pageMargin}mm`,
        }}
        id="resume-preview"
      >
        <Template resume={content} visibleSet={visibleSet} />
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">
        A4 (210mm × 297mm)
      </p>
    </div>
  );
}