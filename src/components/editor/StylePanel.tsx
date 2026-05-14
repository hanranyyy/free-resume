"use client";

import { useEditorStore } from "@/lib/editor/store";
import { templateMetaList } from "@/components/templates";
import type { ResumeStyle } from "@/types/resume";

const FONT_OPTIONS: { value: ResumeStyle["fontFamily"]; label: string }[] = [
  { value: "sans", label: "无衬线（默认）" },
  { value: "serif", label: "衬线（宋体）" },
  { value: "mono", label: "等宽" },
];

const PRESET_COLORS = [
  "#2563eb", // blue
  "#0f766e", // teal
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#111827", // near-black
];

export default function StylePanel() {
  const style = useEditorStore((s) => s.style);
  const setStyle = useEditorStore((s) => s.setStyle);
  const templateId = useEditorStore((s) => s.templateId);
  const setMeta = useEditorStore((s) => s.setMeta);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5">
      <Section title="模板">
        <div className="grid grid-cols-1 gap-2">
          {templateMetaList.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setMeta({ templateId: tpl.id })}
              className={`text-left px-3 py-2 rounded border transition-colors ${
                templateId === tpl.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">{tpl.name}</div>
              <div className="text-xs text-gray-500">{tpl.description}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="主色调">
        <div className="flex items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setStyle({ primaryColor: c })}
              className={`w-7 h-7 rounded-full border-2 ${
                style.primaryColor === c ? "border-gray-900" : "border-white"
              }`}
              style={{ backgroundColor: c }}
              aria-label={`主色 ${c}`}
            />
          ))}
          <input
            type="color"
            value={style.primaryColor}
            onChange={(e) => setStyle({ primaryColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            aria-label="自定义主色"
          />
        </div>
      </Section>

      <Section title="字体">
        <select
          value={style.fontFamily}
          onChange={(e) =>
            setStyle({ fontFamily: e.target.value as ResumeStyle["fontFamily"] })
          }
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-500"
        >
          {FONT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Section>

      <SliderField
        label="字号"
        value={style.fontSize}
        min={10}
        max={20}
        step={1}
        suffix="px"
        onChange={(v) => setStyle({ fontSize: v })}
      />

      <SliderField
        label="行高"
        value={style.lineHeight}
        min={1.2}
        max={2}
        step={0.1}
        suffix=""
        onChange={(v) => setStyle({ lineHeight: Number(v.toFixed(1)) })}
      />

      <SliderField
        label="页边距"
        value={style.pageMargin}
        min={8}
        max={28}
        step={1}
        suffix="mm"
        onChange={(v) => setStyle({ pageMargin: v })}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, suffix, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </h3>
        <span className="text-xs text-gray-600">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  );
}