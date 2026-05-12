import type { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

/**
 * Modern 模板：左右分栏现代风（深色侧边栏）
 * 适合：设计/产品/创意行业
 */
export default function ModernTemplate({ resume }: Props) {
  const { basics, work, education, projects, skills, awards } = resume;

  return (
    <article className="bg-white text-gray-800 w-full aspect-[1/1.414] grid grid-cols-[35%_65%] shadow-md overflow-hidden">
      {/* Left sidebar */}
      <aside className="bg-slate-800 text-slate-100 p-7">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight">{basics.name}</h1>
          <p className="text-sm text-teal-300 mt-1">{basics.title}</p>
        </div>

        <SidebarSection title="联系方式">
          <ul className="text-[12px] text-slate-300 space-y-1.5 break-all">
            <li>📧 {basics.email}</li>
            <li>📱 {basics.phone}</li>
            <li>📍 {basics.location}</li>
            {basics.website && <li>🔗 {basics.website}</li>}
          </ul>
        </SidebarSection>

        <SidebarSection title="教育背景">
          {education.map((e, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-[13px] font-semibold text-white">{e.school}</p>
              <p className="text-[12px] text-slate-300">
                {e.degree} · {e.major}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {e.startDate} - {e.endDate}
              </p>
            </div>
          ))}
        </SidebarSection>

        <SidebarSection title="专业技能">
          {skills.map((s, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-[12px] font-semibold text-teal-300 mb-1">
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
          ))}
        </SidebarSection>

        {awards && awards.length > 0 && (
          <SidebarSection title="荣誉奖项">
            <ul className="text-[12px] text-slate-300 space-y-1.5 list-disc list-outside ml-4">
              {awards.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </SidebarSection>
        )}
      </aside>

      {/* Right main */}
      <main className="p-8">
        {basics.summary && (
          <MainSection title="关于我">
            <p className="text-[13px] text-gray-700 leading-7">{basics.summary}</p>
          </MainSection>
        )}

        <MainSection title="工作经历">
          {work.map((w, i) => (
            <div key={i} className="mb-5 last:mb-0 relative pl-5 border-l-2 border-teal-400">
              <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-teal-400" />
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <h3 className="font-bold text-[14px] text-gray-900">{w.position}</h3>
                <span className="text-[11px] text-gray-500">
                  {w.startDate} - {w.endDate}
                </span>
              </div>
              <p className="text-[13px] text-teal-600 font-medium">{w.company}</p>
              <ul className="list-disc list-outside ml-5 mt-1.5 text-[12.5px] text-gray-700 space-y-0.5">
                {w.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </MainSection>

        <MainSection title="项目经历">
          {projects.map((p, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <h3 className="font-bold text-[14px] text-gray-900">{p.name}</h3>
                {p.startDate && (
                  <span className="text-[11px] text-gray-500">
                    {p.startDate} - {p.endDate}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-700 mt-1">{p.description}</p>
              {p.highlights && (
                <ul className="list-disc list-outside ml-5 mt-1 text-[12.5px] text-gray-700 space-y-0.5">
                  {p.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MainSection>
      </main>
    </article>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="text-[13px] font-bold text-white uppercase tracking-widest border-b border-slate-600 pb-1 mb-2.5">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="text-[16px] font-bold text-slate-800 mb-3 relative inline-block">
        {title}
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400" />
      </h2>
      {children}
    </section>
  );
}