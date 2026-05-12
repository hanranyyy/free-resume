import type { Resume } from "@/types/resume";

export const sampleResume: Resume = {
  basics: {
    name: "张三",
    title: "高级前端工程师",
    email: "zhangsan@example.com",
    phone: "138-0000-0000",
    location: "北京市 朝阳区",
    website: "github.com/zhangsan",
    summary:
      "5 年前端开发经验，专注于 React 生态、性能优化与工程化建设。曾主导多个百万级 DAU 产品的重构，对组件设计、可访问性和动画细节有深入理解。",
  },
  work: [
    {
      company: "字节跳动",
      position: "高级前端工程师",
      startDate: "2023.06",
      endDate: "至今",
      highlights: [
        "主导基础组件库从 0 到 1 的设计与实现，覆盖 80+ 业务方，月均下载 12k+",
        "推动构建工具从 Webpack 迁移至 Vite，本地启动从 28s 降至 1.2s",
        "建立前端性能监控体系，核心页面 LCP 从 3.4s 优化到 1.6s",
      ],
    },
    {
      company: "美团",
      position: "前端工程师",
      startDate: "2021.07",
      endDate: "2023.05",
      highlights: [
        "负责商家管理后台 React 重构，代码体积减少 35%，首屏速度提升 2x",
        "设计并落地微前端方案，支持 8 个业务子系统独立部署",
        "撰写团队前端规范与组件文档，被新入职同学评为最实用资料",
      ],
    },
  ],
  education: [
    {
      school: "北京邮电大学",
      degree: "硕士",
      major: "计算机科学与技术",
      startDate: "2019.09",
      endDate: "2021.06",
      description: "GPA 3.8/4.0，校级一等奖学金",
    },
    {
      school: "山东大学",
      degree: "本科",
      major: "软件工程",
      startDate: "2015.09",
      endDate: "2019.06",
    },
  ],
  projects: [
    {
      name: "Fre简历 - 在线简历生成器",
      role: "技术负责人",
      startDate: "2025.03",
      endDate: "至今",
      description: "基于 Next.js + TypeScript 的开源简历工具，支持多模板与一键导出 PDF。",
      highlights: [
        "GitHub 开源，累计 Star 3.2k+",
        "首屏 < 1s，Lighthouse 性能分 98",
        "支持 JSON Resume 标准导入导出",
      ],
      url: "github.com/example/free-resume",
    },
  ],
  skills: [
    { category: "前端框架", items: ["React", "Next.js", "Vue 3"] },
    { category: "语言", items: ["TypeScript", "JavaScript", "Node.js", "Go"] },
    { category: "工程化", items: ["Vite", "Webpack", "Turbopack", "ESLint"] },
    { category: "其他", items: ["Tailwind CSS", "Storybook", "Playwright"] },
  ],
  awards: ["2024 字节跳动季度最佳新人", "2022 美团技术沙龙优秀讲师"],
};