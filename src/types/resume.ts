// Resume 数据结构（参考 JSON Resume Schema 简化版）
// https://jsonresume.org/schema/

export interface ResumeBasics {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary?: string;
  avatar?: string;
}

export interface WorkItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ProjectItem {
  name: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  highlights?: string[];
  url?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

/** 简历区块标识 */
export type SectionKey =
  | "basics"
  | "summary"
  | "work"
  | "education"
  | "projects"
  | "skills"
  | "awards";

/** 区块显示配置：控制顺序与显隐 */
export interface SectionConfig {
  key: SectionKey;
  visible: boolean;
}

export interface Resume {
  basics: ResumeBasics;
  work: WorkItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  awards?: string[];
  /** 区块顺序与显隐配置（不存在时使用默认顺序） */
  sections?: SectionConfig[];
}

/** 编辑器外观样式配置 */
export interface ResumeStyle {
  /** 主色调（hex） */
  primaryColor: string;
  /** 字体族 */
  fontFamily: "sans" | "serif" | "mono";
  /** 基准字号（px） */
  fontSize: number;
  /** 行高倍数 */
  lineHeight: number;
  /** A4 内边距（mm） */
  pageMargin: number;
}

export const defaultResumeStyle: ResumeStyle = {
  primaryColor: "#2563eb",
  fontFamily: "sans",
  fontSize: 14,
  lineHeight: 1.6,
  pageMargin: 16,
};

export const defaultSections: SectionConfig[] = [
  { key: "basics", visible: true },
  { key: "summary", visible: true },
  { key: "work", visible: true },
  { key: "education", visible: true },
  { key: "projects", visible: true },
  { key: "skills", visible: true },
  { key: "awards", visible: true },
];

export type TemplateId = "classic" | "modern" | "minimal";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  tags: string[];
}