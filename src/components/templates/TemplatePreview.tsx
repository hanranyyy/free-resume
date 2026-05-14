"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { templateRegistry } from "@/components/templates";
import { sampleResume } from "@/data/sampleResume";
import type { TemplateId } from "@/types/resume";

interface Props {
  templateId: TemplateId;
  /** 主色调 */
  primaryColor?: string;
  className?: string;
}

/**
 * 模板缩略图：按 A4 (210mm × 297mm) 渲染真实模板组件，
 * 通过 ResizeObserver 监听容器宽度计算 scale，
 * 让首页/模板中心直接看到真实模板效果。
 */
export default function TemplatePreview({
  templateId,
  primaryColor = "#2563eb",
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.25);

  const Template = templateRegistry[templateId];

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const PAGE_WIDTH_PX = 794; // 210mm @ 96dpi

    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / PAGE_WIDTH_PX);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full overflow-hidden bg-white ${className ?? ""}`}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 bg-white origin-top-left pointer-events-none"
        style={{
          width: "210mm",
          minHeight: "297mm",
          transform: `scale(${scale})`,
          ["--resume-padding" as string]: "12mm",
          ["--resume-primary" as string]: primaryColor,
        }}
      >
        <Template resume={sampleResume} />
      </div>
    </div>
  );
}