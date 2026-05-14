"use client";

import { useEditorStore } from "@/lib/editor/store";
import type {
  EducationItem,
  ProjectItem,
  Resume,
  SectionKey,
  SkillGroup,
  WorkItem,
} from "@/types/resume";
import RichTextField from "./RichTextField";

interface Props {
  sectionKey: SectionKey;
}

export default function ContentForm({ sectionKey }: Props) {
  switch (sectionKey) {
    case "basics":
      return <BasicsForm />;
    case "summary":
      return <SummaryForm />;
    case "work":
      return <WorkForm />;
    case "education":
      return <EducationForm />;
    case "projects":
      return <ProjectsForm />;
    case "skills":
      return <SkillsForm />;
    case "awards":
      return <AwardsForm />;
    default:
      return null;
  }
}

// ---------- helpers ----------

function useContentPatch() {
  const setContent = useEditorStore((s) => s.setContent);
  return (updater: (prev: Resume) => Resume) => setContent(updater);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white";

// ---------- Basics ----------
function BasicsForm() {
  const basics = useEditorStore((s) => s.content.basics);
  const patch = useContentPatch();

  const set = (field: keyof typeof basics, value: string) =>
    patch((prev) => ({ ...prev, basics: { ...prev.basics, [field]: value } }));

  return (
    <Section title="基本信息">
      <div className="grid grid-cols-2 gap-3">
        <Field label="姓名">
          <input className={inputCls} value={basics.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="求职岗位">
          <input className={inputCls} value={basics.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="邮箱">
          <input className={inputCls} value={basics.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="电话">
          <input className={inputCls} value={basics.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="所在城市">
          <input className={inputCls} value={basics.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="个人网站">
          <input className={inputCls} value={basics.website ?? ""} onChange={(e) => set("website", e.target.value)} />
        </Field>
      </div>
    </Section>
  );
}

// ---------- Summary ----------
function SummaryForm() {
  const summary = useEditorStore((s) => s.content.basics.summary ?? "");
  const patch = useContentPatch();
  return (
    <Section title="个人简介">
      <RichTextField
        value={summary}
        onChange={(v) =>
          patch((prev) => ({ ...prev, basics: { ...prev.basics, summary: v } }))
        }
        minHeight={140}
      />
    </Section>
  );
}

// ---------- Work ----------
function WorkForm() {
  const work = useEditorStore((s) => s.content.work);
  const patch = useContentPatch();

  const updateItem = (i: number, next: Partial<WorkItem>) =>
    patch((prev) => ({
      ...prev,
      work: prev.work.map((w, idx) => (idx === i ? { ...w, ...next } : w)),
    }));
  const addItem = () =>
    patch((prev) => ({
      ...prev,
      work: [
        ...prev.work,
        { company: "", position: "", startDate: "", endDate: "", highlights: [] },
      ],
    }));
  const removeItem = (i: number) =>
    patch((prev) => ({ ...prev, work: prev.work.filter((_, idx) => idx !== i) }));

  return (
    <Section title="工作经历" onAdd={addItem}>
      {work.map((w, i) => (
        <Card key={i} onRemove={() => removeItem(i)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="公司">
              <input className={inputCls} value={w.company} onChange={(e) => updateItem(i, { company: e.target.value })} />
            </Field>
            <Field label="职位">
              <input className={inputCls} value={w.position} onChange={(e) => updateItem(i, { position: e.target.value })} />
            </Field>
            <Field label="开始时间">
              <input className={inputCls} value={w.startDate} placeholder="2023.06" onChange={(e) => updateItem(i, { startDate: e.target.value })} />
            </Field>
            <Field label="结束时间">
              <input className={inputCls} value={w.endDate} placeholder="至今" onChange={(e) => updateItem(i, { endDate: e.target.value })} />
            </Field>
          </div>
          <Field label="工作描述（每行一条，支持富文本/Markdown）">
            <RichTextField
              value={highlightsToHTML(w.highlights)}
              onChange={(html) => updateItem(i, { highlights: htmlToHighlights(html) })}
              minHeight={120}
            />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

// ---------- Education ----------
function EducationForm() {
  const education = useEditorStore((s) => s.content.education);
  const patch = useContentPatch();

  const updateItem = (i: number, next: Partial<EducationItem>) =>
    patch((prev) => ({
      ...prev,
      education: prev.education.map((e, idx) => (idx === i ? { ...e, ...next } : e)),
    }));
  const addItem = () =>
    patch((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", major: "", startDate: "", endDate: "" },
      ],
    }));
  const removeItem = (i: number) =>
    patch((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  return (
    <Section title="教育背景" onAdd={addItem}>
      {education.map((e, i) => (
        <Card key={i} onRemove={() => removeItem(i)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="学校">
              <input className={inputCls} value={e.school} onChange={(ev) => updateItem(i, { school: ev.target.value })} />
            </Field>
            <Field label="学位">
              <input className={inputCls} value={e.degree} onChange={(ev) => updateItem(i, { degree: ev.target.value })} />
            </Field>
            <Field label="专业">
              <input className={inputCls} value={e.major} onChange={(ev) => updateItem(i, { major: ev.target.value })} />
            </Field>
            <Field label="时间">
              <div className="flex gap-2">
                <input className={inputCls} placeholder="2019.09" value={e.startDate} onChange={(ev) => updateItem(i, { startDate: ev.target.value })} />
                <input className={inputCls} placeholder="2023.06" value={e.endDate} onChange={(ev) => updateItem(i, { endDate: ev.target.value })} />
              </div>
            </Field>
          </div>
          <Field label="备注">
            <input className={inputCls} value={e.description ?? ""} onChange={(ev) => updateItem(i, { description: ev.target.value })} />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

// ---------- Projects ----------
function ProjectsForm() {
  const projects = useEditorStore((s) => s.content.projects);
  const patch = useContentPatch();

  const updateItem = (i: number, next: Partial<ProjectItem>) =>
    patch((prev) => ({
      ...prev,
      projects: prev.projects.map((p, idx) => (idx === i ? { ...p, ...next } : p)),
    }));
  const addItem = () =>
    patch((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "" }],
    }));
  const removeItem = (i: number) =>
    patch((prev) => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));

  return (
    <Section title="项目经历" onAdd={addItem}>
      {projects.map((p, i) => (
        <Card key={i} onRemove={() => removeItem(i)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="项目名称">
              <input className={inputCls} value={p.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
            </Field>
            <Field label="角色">
              <input className={inputCls} value={p.role ?? ""} onChange={(e) => updateItem(i, { role: e.target.value })} />
            </Field>
            <Field label="开始时间">
              <input className={inputCls} value={p.startDate ?? ""} onChange={(e) => updateItem(i, { startDate: e.target.value })} />
            </Field>
            <Field label="结束时间">
              <input className={inputCls} value={p.endDate ?? ""} onChange={(e) => updateItem(i, { endDate: e.target.value })} />
            </Field>
          </div>
          <Field label="项目描述">
            <RichTextField
              value={p.description}
              onChange={(v) => updateItem(i, { description: v })}
              minHeight={100}
            />
          </Field>
        </Card>
      ))}
    </Section>
  );
}

// ---------- Skills ----------
function SkillsForm() {
  const skills = useEditorStore((s) => s.content.skills);
  const patch = useContentPatch();

  const updateItem = (i: number, next: Partial<SkillGroup>) =>
    patch((prev) => ({
      ...prev,
      skills: prev.skills.map((s, idx) => (idx === i ? { ...s, ...next } : s)),
    }));
  const addItem = () =>
    patch((prev) => ({ ...prev, skills: [...prev.skills, { category: "", items: [] }] }));
  const removeItem = (i: number) =>
    patch((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));

  return (
    <Section title="专业技能" onAdd={addItem}>
      {skills.map((s, i) => (
        <Card key={i} onRemove={() => removeItem(i)}>
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <Field label="分类">
              <input className={inputCls} value={s.category} onChange={(e) => updateItem(i, { category: e.target.value })} />
            </Field>
            <Field label="技能（逗号或斜杠分隔）">
              <input
                className={inputCls}
                value={s.items.join(", ")}
                onChange={(e) =>
                  updateItem(i, {
                    items: e.target.value
                      .split(/[，,/、]/)
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </div>
        </Card>
      ))}
    </Section>
  );
}

// ---------- Awards ----------
function AwardsForm() {
  const awards = useEditorStore((s) => s.content.awards ?? []);
  const patch = useContentPatch();

  return (
    <Section
      title="荣誉奖项"
      onAdd={() => patch((prev) => ({ ...prev, awards: [...(prev.awards ?? []), ""] }))}
    >
      {awards.map((a, i) => (
        <Card
          key={i}
          onRemove={() =>
            patch((prev) => ({
              ...prev,
              awards: (prev.awards ?? []).filter((_, idx) => idx !== i),
            }))
          }
        >
          <input
            className={inputCls}
            value={a}
            placeholder="例：2024 公司季度最佳新人"
            onChange={(e) =>
              patch((prev) => ({
                ...prev,
                awards: (prev.awards ?? []).map((x, idx) => (idx === i ? e.target.value : x)),
              }))
            }
          />
        </Card>
      ))}
    </Section>
  );
}

// ---------- layout helpers ----------
function Section({
  title,
  children,
  onAdd,
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            + 添加
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Card({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 text-xs text-gray-400 hover:text-red-500"
      >
        删除
      </button>
      {children}
    </div>
  );
}

// ---------- utils ----------
function highlightsToHTML(list: string[]): string {
  if (list.length === 0) return "";
  return `<ul>${list.map((h) => `<li>${h}</li>`).join("")}</ul>`;
}

function htmlToHighlights(html: string): string[] {
  // 用正则抽取 li（简单够用），再去除内部标签
  const lis = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? [];
  if (lis.length > 0) {
    return lis
      .map((li) => li.replace(/<li[^>]*>|<\/li>|<[^>]+>/gi, "").trim())
      .filter(Boolean);
  }
  // 无列表时按段落拆行
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}