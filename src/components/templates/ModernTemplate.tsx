import type { Resume, SectionKey } from "@/types/resume";

interface Props {
  resume: Resume;
  visibleSet?: Set<SectionKey>;
}

/**
 * Modern 模板：左右分栏现代风（深色侧边栏）
 * 主色调由 CSS 变量 --resume-primary 控制（用于姓名/职位/时间线/标题下划线等强调位置）
 */
export default function ModernTemplate({ resume, visibleSet }: Props) {
  const { basics, work, education, projects, skills, awards } = resume;
  const show = (key: SectionKey) => !visibleSet || visibleSet.has(key);
  const primary = "var(--resume-primary, #2563eb)";

  return (
    <article className="text-gray-800 grid grid-cols-[35%_65%] min-h-full">
      {/* Left sidebar */}
      <aside className="bg-slate-800 text-slate-100 p-7">
        {show("basics") && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold leading-tight">
                {basics.name || "你的姓名"}
              </h1>
              {basics.title && (
                <p className="text-sm mt-1" style={{ color: primary }}>
                  {basics.title}
                </p>
              )}
            </div>

            <SidebarSection title="联系方式" primary={primary}>
              {basics.email || basics.phone || basics.location || basics.website ? (
                <ul className="text-[12px] text-slate-300 space-y-1.5 break-all">
                  {basics.email && <li>📧 {basics.email}</li>}
                  {basics.phone && <li>📱 {basics.phone}</li>}
                  {basics.location && <li>📍 {basics.location}</li>}
                  {basics.website && <li>🔗 {basics.website}</li>}
                </ul>
              ) : (
                <DarkPlaceholder />
              )}
            </SidebarSection>
          </>
        )}

        {show("education") && (
          <SidebarSection title="教育背景" primary={primary}>
            {education.length === 0 ? (
              <DarkPlaceholder />
            ) : (
              education.map((e, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-[13px] font-semibold text-white">{e.school}</p>
                  <p className="text-[12px] text-slate-300">
                    {e.degree} · {e.major}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {e.startDate} - {e.endDate}
                  </p>
                </div>
              ))
            )}
          </SidebarSection>
        )}

        {show("skills") && (
          <SidebarSection title="专业技能" primary={primary}>
            {skills.length === 0 ? (
              <DarkPlaceholder />
            ) : (
              skills.map((s, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p
                    className="text-[12px] font-semibold mb-1"
                    style={{ color: primary }}
                  >
                    {s.category}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {s.items.map((item, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 bg-slate-700 rounded text-[11px] text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </SidebarSection>
        )}

        {show("awards") && (
          <SidebarSection title="荣誉奖项" primary={primary}>
            {!awards || awards.length === 0 ? (
              <DarkPlaceholder />
            ) : (
              <ul className="text-[12px] text-slate-300 space-y-1.5 list-disc list-outside ml-4">
                {awards.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </SidebarSection>
        )}
      </aside>

      {/* Right main */}
      <main className="p-8">
        {show("summary") && (
          <MainSection title="关于我" primary={primary}>
            {basics.summary ? (
              <div
                className="text-[13px] text-gray-700 leading-7"
                dangerouslySetInnerHTML={{ __html: basics.summary }}
              />
            ) : (
              <Placeholder />
            )}
          </MainSection>
        )}

        {show("work") && (
          <MainSection title="工作经历" primary={primary}>
            {work.length === 0 ? (
              <Placeholder />
            ) : (
              work.map((w, i) => (
                <div
                  key={i}
                  className="mb-5 last:mb-0 relative pl-5"
                  style={{ borderLeft: `2px solid ${primary}` }}
                >
                  <div
                    className="absolute -left-[7px] top-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: primary }}
                  />
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="font-bold text-[14px] text-gray-900">{w.position}</h3>
                    <span className="text-[11px] text-gray-500">
                      {w.startDate} - {w.endDate}
                    </span>
                  </div>
                  <p
                    className="text-[13px] font-medium"
                    style={{ color: primary }}
                  >
                    {w.company}
                  </p>
                  <ul className="list-disc list-outside ml-5 mt-1.5 text-[12.5px] text-gray-700 space-y-0.5">
                    {w.highlights.map((h, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: h }} />
                    ))}
                  </ul>
                </div>
              ))
            )}
          </MainSection>
        )}

        {show("projects") && (
          <MainSection title="项目经历" primary={primary}>
            {projects.length === 0 ? (
              <Placeholder />
            ) : (
              projects.map((p, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="font-bold text-[14px] text-gray-900">{p.name}</h3>
                    {p.startDate && (
                      <span className="text-[11px] text-gray-500">
                        {p.startDate} - {p.endDate}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-[13px] text-gray-700 mt-1"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                </div>
              ))
            )}
          </MainSection>
        )}
      </main>
    </article>
  );
}

function SidebarSection({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h2
        className="text-[13px] font-bold uppercase tracking-widest pb-1 mb-2.5"
        style={{ color: primary, borderBottom: `1px solid ${primary}` }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function MainSection({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="text-[16px] font-bold text-slate-800 mb-3 relative inline-block">
        {title}
        <span
          className="absolute -bottom-1 left-0 w-full h-0.5"
          style={{ backgroundColor: primary }}
        />
      </h2>
      {children}
    </section>
  );
}

function Placeholder() {
  return <p className="text-[12px] text-gray-300 italic">暂无内容</p>;
}

function DarkPlaceholder() {
  return <p className="text-[12px] text-slate-500 italic">暂无内容</p>;
}