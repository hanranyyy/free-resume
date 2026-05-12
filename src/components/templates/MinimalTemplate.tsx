import type { Resume } from "@/types/resume";

interface Props {
  resume: Resume;
}

/**
 * Minimal 模板：极简黑白学术风
 * 适合：学术/科研/海外申请
 */
export default function MinimalTemplate({ resume }: Props) {
  const { basics, work, education, projects, skills, awards } = resume;

  return (
    <article className="bg-white text-neutral-900 w-full aspect-[1/1.414] p-12 shadow-md font-serif">
      {/* Header */}
      <header className="text-center mb-8 pb-5 border-b border-neutral-300">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase">
          {basics.name}
        </h1>
        <p className="text-[12px] text-neutral-500 mt-2 tracking-widest uppercase">
          {basics.title}
        </p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-neutral-600">
          <span>{basics.email}</span>
          <span>·</span>
          <span>{basics.phone}</span>
          <span>·</span>
          <span>{basics.location}</span>
          {basics.website && (
            <>
              <span>·</span>
              <span>{basics.website}</span>
            </>
          )}
        </div>
      </header>

      {basics.summary && (
        <Section title="Profile">
          <p className="text-[13px] text-neutral-700 leading-7 italic">
            {basics.summary}
          </p>
        </Section>
      )}

      <Section title="Experience">
        {work.map((w, i) => (
          <Entry
            key={i}
            title={w.position}
            subtitle={w.company}
            date={`${w.startDate} – ${w.endDate}`}
            highlights={w.highlights}
          />
        ))}
      </Section>

      <Section title="Education">
        {education.map((e, i) => (
          <Entry
            key={i}
            title={`${e.degree} in ${e.major}`}
            subtitle={e.school}
            date={`${e.startDate} – ${e.endDate}`}
            description={e.description}
          />
        ))}
      </Section>

      <Section title="Projects">
        {projects.map((p, i) => (
          <Entry
            key={i}
            title={p.name}
            subtitle={p.role}
            date={p.startDate ? `${p.startDate} – ${p.endDate}` : undefined}
            description={p.description}
            highlights={p.highlights}
          />
        ))}
      </Section>

      <Section title="Skills">
        <div className="space-y-1">
          {skills.map((s, i) => (
            <p key={i} className="text-[13px] text-neutral-700">
              <span className="font-semibold text-neutral-900 w-24 inline-block">
                {s.category}
              </span>
              {s.items.join(", ")}
            </p>
          ))}
        </div>
      </Section>

      {awards && awards.length > 0 && (
        <Section title="Awards">
          <ul className="text-[13px] text-neutral-700 space-y-0.5 list-none">
            {awards.map((a, i) => (
              <li key={i}>— {a}</li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 last:mb-0">
      <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

interface EntryProps {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  highlights?: string[];
}

function Entry({ title, subtitle, date, description, highlights }: EntryProps) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-baseline flex-wrap gap-1">
        <h3 className="text-[14px] font-semibold text-neutral-900">
          {title}
          {subtitle && (
            <span className="font-normal text-neutral-600"> — {subtitle}</span>
          )}
        </h3>
        {date && <span className="text-[11px] text-neutral-500 italic">{date}</span>}
      </div>
      {description && (
        <p className="text-[13px] text-neutral-700 mt-1 leading-6">{description}</p>
      )}
      {highlights && (
        <ul className="mt-1 text-[13px] text-neutral-700 space-y-0.5 list-none">
          {highlights.map((h, j) => (
            <li key={j} className="pl-3 relative leading-6">
              <span className="absolute left-0">·</span>
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}