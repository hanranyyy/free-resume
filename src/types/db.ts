import type { Resume, ResumeStyle, TemplateId } from "./resume";

/** 简历持久化配置（样式等非内容项） */
export interface ResumeSettings {
  style?: ResumeStyle;
}

/**
 * resumes 表的数据库行
 */
export interface ResumeRow {
  id: string;
  title: string;
  template_id: TemplateId;
  content: Resume;
  settings: ResumeSettings;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

/** 创建简历入参 */
export interface CreateResumePayload {
  title?: string;
  template_id?: TemplateId;
  content: Resume;
  settings?: ResumeSettings;
}

/** 更新简历入参（局部更新） */
export type UpdateResumePayload = Partial<CreateResumePayload>;