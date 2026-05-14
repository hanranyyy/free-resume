"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface Bounds {
  /** 最小宽度（px） */
  min: number;
  /** 最大宽度（px） */
  max: number;
  /** 默认宽度（px） */
  initial: number;
}

interface Props {
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
  /** 左/右栏的宽度限制 */
  leftBounds?: Bounds;
  rightBounds?: Bounds;
  /** 持久化 key 前缀（不同页面使用不同前缀避免冲突） */
  storageKey?: string;
}

const DEFAULT_LEFT: Bounds = { min: 280, max: 600, initial: 380 };
const DEFAULT_RIGHT: Bounds = { min: 200, max: 520, initial: 260 };

/**
 * 三栏布局，左右两列宽度可通过中间分隔条拖拽调整。
 * 中间列自动占满剩余空间，宽度由 grid-template-columns 控制。
 * 拖拽时锁定 body 的 cursor / userSelect 避免选中文字。
 */
export default function ResizableLayout({
  left,
  middle,
  right,
  leftBounds = DEFAULT_LEFT,
  rightBounds = DEFAULT_RIGHT,
  storageKey = "editor-layout",
}: Props) {
  const [leftWidth, setLeftWidth] = useState<number>(leftBounds.initial);
  const [rightWidth, setRightWidth] = useState<number>(rightBounds.initial);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化：从 localStorage 读取上次保存的宽度
  useEffect(() => {
    try {
      const l = Number(localStorage.getItem(`${storageKey}:left`));
      const r = Number(localStorage.getItem(`${storageKey}:right`));
      if (Number.isFinite(l) && l >= leftBounds.min && l <= leftBounds.max) {
        setLeftWidth(l);
      }
      if (Number.isFinite(r) && r >= rightBounds.min && r <= rightBounds.max) {
        setRightWidth(r);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDrag = useCallback(
    (side: "left" | "right") => (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startLeft = leftWidth;
      const startRight = rightWidth;
      const containerWidth = containerRef.current?.clientWidth ?? 0;

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        if (side === "left") {
          const next = clamp(startLeft + dx, leftBounds.min, leftBounds.max);
          // 防止挤压中间栏过窄（保留至少 320px 给预览）
          if (containerWidth - next - rightWidth >= 320) setLeftWidth(next);
        } else {
          // 向左拖（dx<0）右栏变宽
          const next = clamp(startRight - dx, rightBounds.min, rightBounds.max);
          if (containerWidth - leftWidth - next >= 320) setRightWidth(next);
        }
      };

      const onUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        try {
          if (side === "left") {
            const w = Number(
              (containerRef.current as HTMLDivElement).style
                .getPropertyValue("--left-w")
                .replace("px", "")
            );
            // 直接读 state 最新值更稳：用 window 临时变量回退
            const finalLeft = Number.isFinite(w) && w > 0 ? w : leftWidth;
            localStorage.setItem(`${storageKey}:left`, String(finalLeft));
          } else {
            const w = Number(
              (containerRef.current as HTMLDivElement).style
                .getPropertyValue("--right-w")
                .replace("px", "")
            );
            const finalRight = Number.isFinite(w) && w > 0 ? w : rightWidth;
            localStorage.setItem(`${storageKey}:right`, String(finalRight));
          }
        } catch {
          /* ignore */
        }
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [leftWidth, rightWidth, leftBounds, rightBounds, storageKey]
  );

  // 持久化最新值（拖拽结束才写也行，这里 useEffect 兜底）
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}:left`, String(leftWidth));
    } catch {
      /* ignore */
    }
  }, [leftWidth, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}:right`, String(rightWidth));
    } catch {
      /* ignore */
    }
  }, [rightWidth, storageKey]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex overflow-hidden"
      style={
        {
          "--left-w": `${leftWidth}px`,
          "--right-w": `${rightWidth}px`,
        } as React.CSSProperties
      }
    >
      {/* 左栏 */}
      <aside
        className="bg-white border-r border-gray-200 overflow-hidden shrink-0"
        style={{ width: leftWidth }}
      >
        {left}
      </aside>

      {/* 左分隔条 */}
      <Divider onMouseDown={startDrag("left")} />

      {/* 中栏 */}
      <section className="flex-1 overflow-hidden min-w-0">{middle}</section>

      {/* 右分隔条 */}
      <Divider onMouseDown={startDrag("right")} />

      {/* 右栏 */}
      <aside
        className="bg-white border-l border-gray-200 overflow-hidden shrink-0"
        style={{ width: rightWidth }}
      >
        {right}
      </aside>
    </div>
  );
}

function Divider({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onMouseDown={onMouseDown}
      className="group relative w-1 shrink-0 cursor-col-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-500 transition-colors"
      title="拖拽调整宽度"
    >
      {/* 加宽热区，但视觉只占 1px */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}