"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import { marked } from "marked";
import TurndownService from "turndown";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "rich" | "markdown";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 简单单行/多行内容时可关掉模式切换 */
  allowModeSwitch?: boolean;
  minHeight?: number;
}

/**
 * 富文本与 Markdown 双模式输入。
 * value 统一使用 HTML 字符串存储；Markdown 模式下编辑源码，提交前用 marked 转 HTML。
 *
 * 富文本支持：标题 H2/H3、加粗、斜体、下划线、删除线、行内代码、高亮、链接、
 *   引用、无序/有序列表、代码块、分割线、左/中/右对齐、撤销/重做、清除格式。
 */
export default function RichTextField({
  value,
  onChange,
  placeholder,
  allowModeSwitch = true,
  minHeight = 140,
}: Props) {
  const [mode, setMode] = useState<Mode>("rich");
  const [mdText, setMdText] = useState<string>("");
  // 用 ref 持有最新的 mode，避免 onUpdate 闭包读到旧值
  const modeRef = useRef<Mode>(mode);
  modeRef.current = mode;

  const turndown = useMemo(() => {
    const t = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
    });
    // 保留下划线、删除线与高亮（Markdown 没有标准语法，退而求其次输出 HTML）
    t.addRule("underline", {
      filter: ["u"],
      replacement: (content) => `<u>${content}</u>`,
    });
    t.addRule("strike", {
      filter: ["s", "del"],
      replacement: (content) => `~~${content}~~`,
    });
    t.addRule("mark", {
      filter: ["mark"],
      replacement: (content) => `==${content}==`,
    });
    return t;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // codeBlock/blockquote/horizontalRule/strike/code 都已随 StarterKit 提供
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Typography,
      Placeholder.configure({
        placeholder: placeholder ?? "在此输入内容，支持快捷键与工具栏格式化",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none px-3 py-2 min-h-[80px] " +
          "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 [&_blockquote]:italic " +
          "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-[0.85em] " +
          "[&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-[12px] [&_pre]:overflow-x-auto " +
          "[&_mark]:bg-yellow-200 [&_mark]:px-0.5 [&_mark]:rounded-sm " +
          "[&_hr]:my-3 [&_hr]:border-gray-300 " +
          "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold",
      },
    },
    onUpdate: ({ editor }) => {
      if (modeRef.current === "rich") onChange(editor.getHTML());
    },
  });

  // 外部 value 变化时同步到编辑器（避免 undo/redo 不回滚编辑器内部状态）
  useEffect(() => {
    if (!editor) return;
    if (mode !== "rich") return;
    if (editor.getHTML() !== (value || "")) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor, mode]);

  const switchTo = (next: Mode) => {
    if (next === mode) return;
    if (next === "markdown") {
      const html = editor?.getHTML() ?? value ?? "";
      setMdText(turndown.turndown(html));
    } else {
      const html = marked.parse(mdText, { async: false }) as string;
      onChange(html);
      editor?.commands.setContent(html, { emitUpdate: false });
    }
    setMode(next);
  };

  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
      style={{ minHeight }}
    >
      {allowModeSwitch && (
        <div className="flex items-center justify-between border-b border-gray-100 px-2 py-1 bg-gray-50/60 gap-2 flex-wrap">
          <RichToolbar editor={editor} disabled={mode !== "rich"} />
          <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs shrink-0">
            <ModeButton active={mode === "rich"} onClick={() => switchTo("rich")}>
              富文本
            </ModeButton>
            <ModeButton
              active={mode === "markdown"}
              onClick={() => switchTo("markdown")}
            >
              Markdown
            </ModeButton>
          </div>
        </div>
      )}
      {mode === "rich" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={mdText}
          onChange={(e) => {
            setMdText(e.target.value);
            const html = marked.parse(e.target.value, { async: false }) as string;
            onChange(html);
          }}
          placeholder={placeholder ?? "支持 Markdown 语法，如 **粗体**、- 列表、# 标题"}
          className="w-full px-3 py-2 text-sm font-mono focus:outline-none resize-y"
          style={{ minHeight }}
        />
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 ${
        active ? "bg-gray-800 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/* --------------------------- 富文本工具栏 --------------------------- */

function RichToolbar({
  editor,
  disabled,
}: {
  editor: Editor | null;
  disabled: boolean;
}) {
  if (!editor) return <div />;

  const promptLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("链接地址", prev ?? "https://");
    if (url === null) return; // 取消
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {/* 历史 */}
      <ToolbarGroup>
        <ToolBtn
          label="↶"
          title="撤销 (⌘Z)"
          disabled={disabled || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolBtn
          label="↷"
          title="重做 (⇧⌘Z)"
          disabled={disabled || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </ToolbarGroup>

      {/* 标题 */}
      <ToolbarGroup>
        <ToolBtn
          label="P"
          title="正文"
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
          disabled={disabled}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />
        <ToolBtn
          label="H2"
          title="标题 2"
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolBtn
          label="H3"
          title="标题 3"
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </ToolbarGroup>

      {/* 行内格式 */}
      <ToolbarGroup>
        <ToolBtn
          label={<b>B</b>}
          title="加粗 (⌘B)"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolBtn
          label={<i>I</i>}
          title="斜体 (⌘I)"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolBtn
          label={<u>U</u>}
          title="下划线 (⌘U)"
          active={editor.isActive("underline")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolBtn
          label={<s>S</s>}
          title="删除线"
          active={editor.isActive("strike")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolBtn
          label={<code className="text-[11px]">{"<>"}</code>}
          title="行内代码"
          active={editor.isActive("code")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolBtn
          label={<span className="bg-yellow-200 px-0.5">H</span>}
          title="高亮"
          active={editor.isActive("highlight")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        />
      </ToolbarGroup>

      {/* 链接 */}
      <ToolbarGroup>
        <ToolBtn
          label="🔗"
          title="链接"
          active={editor.isActive("link")}
          disabled={disabled}
          onClick={promptLink}
        />
        {editor.isActive("link") && (
          <ToolBtn
            label="✕🔗"
            title="移除链接"
            disabled={disabled}
            onClick={() => editor.chain().focus().unsetLink().run()}
          />
        )}
      </ToolbarGroup>

      {/* 列表 & 块 */}
      <ToolbarGroup>
        <ToolBtn
          label="•"
          title="无序列表"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolBtn
          label="1."
          title="有序列表"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolBtn
          label="❝"
          title="引用"
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolBtn
          label="{ }"
          title="代码块"
          active={editor.isActive("codeBlock")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <ToolBtn
          label="—"
          title="分割线"
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </ToolbarGroup>

      {/* 对齐 */}
      <ToolbarGroup>
        <ToolBtn
          label="⯇"
          title="左对齐"
          active={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <ToolBtn
          label="☰"
          title="居中"
          active={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <ToolBtn
          label="⯈"
          title="右对齐"
          active={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />
      </ToolbarGroup>

      {/* 清除 */}
      <ToolbarGroup last>
        <ToolBtn
          label="⌫"
          title="清除格式"
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        />
      </ToolbarGroup>
    </div>
  );
}

function ToolbarGroup({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-0.5 ${
        last ? "" : "border-r border-gray-200 pr-1 mr-1"
      }`}
    >
      {children}
    </div>
  );
}

function ToolBtn({
  label,
  title,
  active,
  disabled,
  onClick,
}: {
  label: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[24px] h-6 px-1.5 text-xs rounded flex items-center justify-center transition-colors ${
        active ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-200"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}