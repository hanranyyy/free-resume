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

export interface Resume {
  basics: ResumeBasics;
  work: WorkItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  awards?: string[];
}

export type TemplateId = "classic" | "modern" | "minimal";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  tags: string[];
}