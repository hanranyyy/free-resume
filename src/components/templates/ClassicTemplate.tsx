import type { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

/**
 * Classic 模板：经典蓝色商务风
 * 适合：互联网/金融/咨询，传统投递
 */
export default function ClassicTemplate({ resume }: Props) {
  const { basics, work, education, projects, skills, awards } = resume;

  return (
    <article className="bg-white text-gray-800 font-serif w-full aspect-[1/1.414] p-10 leading-relaxed shadow-md">
      {/* Header */}
      <header className="border-b-4 border-blue-700 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-blue-800 tracking-wide">
          {basics.name}
        </h1>
        <p className="text-lg text-gray-600 mt-1">{basics.title}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-[12px] text-gray-600">
          <span>📧 {basics.email}</span>
          <span>📱 {basics.phone}</span>
          <span>📍 {basics.location}</span>
          {basics.website && <span>🔗 {basics.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && (
        <Section title="个人简介">
          <p className="text-[13px] text-gray-700 leading-7">{basics.summary}</p>
        </Section>
      )}

      {/* Work Experience */}
      <Section title="工作经历">
        {work.map((w, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-[14px] text-gray-900">
                {w.company} · <span className="text-blue-700">{w.position}</span>
              </h3>
              <span className="text-[12px] text-gray-500">
                {w.startDate} - {w.endDate}
              </span>
            </div>
            <ul className="list-disc list-outside ml-5 mt-1.5 text-[13px] text-gray-700 space-y-1">
              {w.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="教育背景">
        {education.map((e, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-[14px]">
                {e.school} · {e.degree} · {e.major}
              </h3>
              <span className="text-[12px] text-gray-500">
                {e.startDate} - {e.endDate}
              </span>
            </div>
            {e.description && (
              <p className="text-[13px] text-gray-600 mt-1">{e.description}</p>
            )}
          </div>
        ))}
      </Section>

      {/* Projects */}
      <Section title="项目经历">
        {projects.map((p, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-[14px]">
                {p.name}
                {p.role && (
                  <span className="text-blue-700"> · {p.role}</span>
                )}
              </h3>
              {p.startDate && (
                <span className="text-[12px] text-gray-500">
                  {p.startDate} - {p.endDate}
                </span>
              )}
            </div>
            <p className="text-[13px] text-gray-700 mt-1">{p.description}</p>
            {p.highlights && (
              <ul className="list-disc list-outside ml-5 mt-1 text-[13px] text-gray-700 space-y-1">
                {p.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section title="专业技能">
        <div className="space-y-1.5">
          {skills.map((s, i) => (
            <div key={i} className="text-[13px]">
              <span className="font-semibold text-gray-900">{s.category}：</span>
              <span className="text-gray-700">{s.items.join(" / ")}</span>
            </div>
          ))}
        </div>
      </Section>

      {awards && awards.length > 0 && (
        <Section title="荣誉奖项">
          <ul className="list-disc list-outside ml-5 text-[13px] text-gray-700 space-y-1">
            {awards.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 last:mb-0">
      <h2 className="text-[15px] font-bold text-blue-800 border-b border-gray-200 pb-1 mb-2.5 tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}