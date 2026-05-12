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
    description: "蓝色主色调，传统排版，适合互联网/金融/咨询岗位投递",
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
    name: "极简学术",
    description: "黑白配色，衬线字体，适合学术/科研/海外申请",
    tags: ["学术", "海外", "极简"],
  },
];

export { ClassicTemplate, ModernTemplate, MinimalTemplate };
export type { TemplateId };