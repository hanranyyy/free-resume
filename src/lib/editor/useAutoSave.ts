"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "./store";

/**
 * 监听 store 的 content/style/title/templateId 变化，
 * 防抖 1.5s 后自动调用 save()。
 */
export function useAutoSave(enabled: boolean) {
  const lastSnapshot = useRef<string>("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    return useEditorStore.subscribe((state) => {
      const snapshot = JSON.stringify({
        t: state.title,
        tpl: state.templateId,
        c: state.content,
        s: state.style,
      });
      if (snapshot === lastSnapshot.current) return;
      lastSnapshot.current = snapshot;

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        useEditorStore.getState().save();
      }, 1500);
    });
  }, [enabled]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
}