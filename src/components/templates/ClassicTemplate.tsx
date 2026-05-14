import type { Resume, SectionKey } from "@/types/resume";

interface Props {
  resume: Resume;
  /** 哪些区块可见；不传时全部显示 */
  visibleSet?: Set<SectionKey>;
}

/**
 * Classic 模板：商务风（蓝色色块标题）
 * 主色调由 CSS 变量 --resume-primary 控制（决定 Section 标题色块与姓名颜色）。
 * 布局：左信息 + 右圆形头像；Section 标题为主色块；条目左右两列；
 *      多段内容用粗体小标题 + 编号列表。
 */
export default function ClassicTemplate({ resume, visibleSet }: Props) {
  const { basics, work, education, projects, skills, awards } = resume;
  const show = (key: SectionKey) => !visibleSet || visibleSet.has(key);
  const primary = "var(--resume-primary, #2563eb)";

  return (
    <article
      className="text-neutral-900 font-sans"
      style={{ padding: "var(--resume-padding, 16mm)" }}
    >
      {/* Header */}
      {show("basics") && (
        <header className="flex items-start justify-between gap-6 mb-6">
          <div className="min-w-0 flex-1">
            {basics.name ? (
              <h1 className="text-[28px] font-bold leading-tight text-neutral-900">
                {basics.name} <span className="font-bold">简历</span>
              </h1>
            ) : (
              <h1 className="text-[28px] font-bold leading-tight text-neutral-300">
                你的姓名 简历
              </h1>
            )}

            {/* 联系方式 */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2.5 text-[12.5px]"
              style={{ color: primary }}
            >
              {basics.phone && (
                <span className="inline-flex items-center gap-1">
                  <PhoneIcon />
                  <span className="text-neutral-800">{basics.phone}</span>
                </span>
              )}
              {basics.email && (
                <span className="inline-flex items-center gap-1">
                  <MailIcon />
                  <span className="text-neutral-800">{basics.email}</span>
                </span>
              )}
              {basics.website && (
                <span className="inline-flex items-center gap-1">
                  <LinkIcon />
                  <span className="text-neutral-800">{basics.website}</span>
                </span>
              )}
            </div>

            {/* 标签：状态 / 意向 / 地点 */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1.5 text-[12.5px] text-neutral-700">
              {basics.title && (
                <span className="inline-flex items-center gap-1">
                  <TagBlueIcon primary={primary} />
                  应届毕业生
                </span>
              )}
              {basics.title && (
                <span className="inline-flex items-center gap-1">
                  <CodeIcon primary={primary} />
                  {basics.title}
                </span>
              )}
              {basics.location && (
                <span className="inline-flex items-center gap-1">
                  <PinIcon primary={primary} />
                  {basics.location}
                </span>
              )}
            </div>
          </div>

          {/* 圆形头像 */}
          {basics.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={basics.avatar}
              alt="头像"
              className="w-[78px] h-[78px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-[78px] h-[78px] rounded-full bg-neutral-100 shrink-0 flex items-center justify-center text-[10px] text-neutral-400">
              头像
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {show("summary") && (
        <Section title="个人简介" primary={primary}>
          {basics.summary ? (
            <div
              className="text-[13px] text-neutral-800 leading-7"
              dangerouslySetInnerHTML={{ __html: basics.summary }}
            />
          ) : (
            <Placeholder />
          )}
        </Section>
      )}

      {/* Education */}
      {show("education") && (
        <Section title="教育经历" primary={primary}>
          {education.length > 0 ? (
            education.map((e, i) => (
              <Row
                key={i}
                left={
                  <>
                    <span className="font-bold text-[14px] text-neutral-900">
                      {e.school || "学校名称"}
                    </span>
                    {(e.major || e.degree) && (
                      <span className="ml-4 text-[12.5px] text-neutral-500">
                        {e.major}
                        {e.major && e.degree ? "    " : ""}
                        {e.degree}
                      </span>
                    )}
                  </>
                }
                date={joinDate(e.startDate, e.endDate)}
                description={e.description}
              />
            ))
          ) : (
            <Placeholder />
          )}
        </Section>
      )}

      {/* Skills */}
      {show("skills") && (
        <Section title="专业技能" primary={primary}>
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.map((s, i) => (
                <div key={i}>
                  <p className="font-bold text-[13px] text-neutral-900 mb-1">
                    {s.category}
                  </p>
                  <div className="text-[13px] text-neutral-800 leading-7">
                    {s.items.join("、")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Placeholder />
          )}
        </Section>
      )}

      {/* Work */}
      {show("work") && (
        <Section title="工作经历" primary={primary}>
          {work.length > 0 ? (
            work.map((w, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <Row
                  left={
                    <span className="font-bold text-[14px] text-neutral-900">
                      {w.company || "公司名称"}
                    </span>
                  }
                  date={joinDate(w.startDate, w.endDate)}
                />
                {w.position && (
                  <p className="text-[12.5px] text-neutral-500 mt-0.5 mb-2">
                    {w.position}
                  </p>
                )}
                {w.highlights && w.highlights.length > 0 && (
                  <ol className="list-decimal list-outside ml-5 text-[13px] text-neutral-800 space-y-1 leading-7">
                    {w.highlights.map((h, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: h }} />
                    ))}
                  </ol>
                )}
              </div>
            ))
          ) : (
            <Placeholder />
          )}
        </Section>
      )}

      {/* Projects */}
      {show("projects") && (
        <Section title="项目经历" primary={primary}>
          {projects.length > 0 ? (
            projects.map((p, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <Row
                  left={
                    <>
                      <span className="font-bold text-[14px] text-neutral-900">
                        {p.name || "项目名称"}
                      </span>
                      {p.role && (
                        <span className="ml-4 text-[12.5px] text-neutral-500">
                          {p.role}
                        </span>
                      )}
                    </>
                  }
                  date={joinDate(p.startDate, p.endDate)}
                />
                {p.description && (
                  <div
                    className="text-[13px] text-neutral-800 leading-7 mt-1"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                )}
                {p.highlights && p.highlights.length > 0 && (
                  <ol className="list-decimal list-outside ml-5 mt-1 text-[13px] text-neutral-800 space-y-1 leading-7">
                    {p.highlights.map((h, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: h }} />
                    ))}
                  </ol>
                )}
              </div>
            ))
          ) : (
            <Placeholder />
          )}
        </Section>
      )}

      {/* Awards */}
      {show("awards") && (
        <Section title="荣誉奖项" primary={primary}>
          {awards && awards.length > 0 ? (
            <ul className="list-disc list-outside ml-5 text-[13px] text-neutral-800 space-y-1 leading-7">
              {awards.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <Placeholder />
          )}
        </Section>
      )}
    </article>
  );
}

/* --------------------------- 子组件 --------------------------- */

function Section({
  title,
  primary,
  children,
}: {
  title: string;
  primary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 last:mb-0">
      <div
        className="flex items-stretch rounded-sm overflow-hidden mb-3"
        style={{ backgroundColor: `color-mix(in srgb, ${primary} 10%, white)` }}
      >
        <div
          className="px-3 py-1 text-white text-[13.5px] font-bold"
          style={{ backgroundColor: primary }}
        >
          {title}
        </div>
        <div className="flex-1" />
      </div>
      {children}
    </section>
  );
}

function Row({
  left,
  date,
  description,
}: {
  left: React.ReactNode;
  date?: string;
  description?: string;
}) {
  return (
    <>
      <div className="flex items-baseline justify-between flex-wrap gap-x-3">
        <div className="min-w-0">{left}</div>
        {date && (
          <span className="text-[12px] text-neutral-400 shrink-0 tabular-nums">
            {date}
          </span>
        )}
      </div>
      {description && (
        <p className="text-[13px] text-neutral-700 mt-1 leading-7">
          {description}
        </p>
      )}
    </>
  );
}

function Placeholder() {
  return (
    <p className="text-[12px] text-neutral-300 italic">
      暂无内容，左侧填写后将自动显示
    </p>
  );
}

function joinDate(start?: string, end?: string): string | undefined {
  if (!start && !end) return undefined;
  return `${start || ""} ~ ${end || ""}`.trim();
}

/* --------------------------- 图标 --------------------------- */

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6a1 1 0 0 0-1 .2l-2.2 2.2a15.1 15.1 0 0 1-6.6-6.6L8.8 8.5a1 1 0 0 0 .2-1A11.4 11.4 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.9 12a3.6 3.6 0 0 1 3.6-3.6h3.7v-2H7.5a5.6 5.6 0 0 0 0 11.2h3.7v-2H7.5A3.6 3.6 0 0 1 3.9 12Zm5.6 1h5v-2h-5v2Zm7-6.6h-3.7v2h3.7a3.6 3.6 0 0 1 0 7.2h-3.7v2h3.7a5.6 5.6 0 0 0 0-11.2Z" />
    </svg>
  );
}
function PinIcon({ primary }: { primary: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={primary}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}
function TagBlueIcon({ primary }: { primary: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={primary}>
      <path d="M21.4 11 12.6 2.2A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8ZM7 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    </svg>
  );
}
function CodeIcon({ primary }: { primary: string }) {
  return (
    <span
      className="inline-flex items-center justify-center text-white text-[9px] font-bold rounded px-1 leading-[14px]"
      style={{ backgroundColor: primary }}
    >
      A1
    </span>
  );
}