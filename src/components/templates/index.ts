import type { TemplateId, TemplateMeta } from "@/types/resume";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";

export const templateRegistry = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
} as const;

export const templateMetaList: TemplateMeta[] = [
  {
    id: "classic",
    name: "经典商务",
    description: "蓝色色块标题 + 圆形头像，紧凑信息密度，适合校招/社招通用投递",
    tags: ["互联网", "正式", "通用"],
  },
  {
    id: "modern",
    name: "现代分栏",
    description: "深色侧边栏 + 时间线，视觉层次清晰，适合产品/设计岗位",
    tags: ["设计", "产品", "现代"],
  },
  {
    id: "minimal",
    name: "极简中文",
    description: "非衬线大姓名 + 头像 + 信息密度高，国内中文岗位投递常用",
    tags: ["中文", "通用", "极简"],
  },
];

export { ClassicTemplate, ModernTemplate, MinimalTemplate };
export type { TemplateId };