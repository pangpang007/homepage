export type ProjectSlug =
  | "dapp-multichain"
  | "official-site"
  | "cloud-platform"
  | "dept-performance"
  | "scheduling-gantt"
  | "iot-nodered";

export type ProjectCard = {
  slug: ProjectSlug;
  title: string;
  period: string;
  summary: string;
  stack: string[];
};

export const projectCards: ProjectCard[] = [
  {
    slug: "dapp-multichain",
    title: "多链 DApp 与增长体系",
    period: "磐沄科技",
    summary:
      "独立交付 Ethereum、Berachain、Carv、Cysic 等多协议 DApp；合约交互、优惠券系统与内部组件库。",
    stack: ["React", "TypeScript", "Web3", "Smart contracts"],
  },
  {
    slug: "official-site",
    title: "公司官网重构与 SEO",
    period: "磐沄科技",
    summary:
      "Next.js 升级与重构，Blog / News / Events 模块与动态 Meta，提升活动检索曝光。",
    stack: ["Next.js", "SEO", "SSR"],
  },
  {
    slug: "cloud-platform",
    title: "区块链云平台（Node / API / Block Watch）",
    period: "磐沄科技",
    summary:
      "节点与 API 订阅、权限与支付、BFF 续费脚本、监控告警分配等企业级能力的前端交付。",
    stack: ["React", "Express", "BFF", "Complex forms"],
  },
  {
    slug: "dept-performance",
    title: "部门性能优化与框架对接",
    period: "用友网络",
    summary:
      "作为部门前端接口人，推进打包与请求治理，解决框架层疑难问题。",
    stack: ["Webpack", "Performance", "Framework internals"],
  },
  {
    slug: "scheduling-gantt",
    title: "智能排程 · 自研甘特图",
    period: "用友网络",
    summary:
      "双层 Canvas 实现可拖拽甘特图，与后台排程数据联动。",
    stack: ["Canvas", "React", "Scheduling"],
  },
  {
    slug: "iot-nodered",
    title: "node-red 与 IoT 自助机",
    period: "用友网络",
    summary:
      "低代码编辑器组件扩展，将业务沉淀为基础组件，对接 IoT 设备接口。",
    stack: ["node-red", "IoT", "React"],
  },
];

export type ProjectDetail = ProjectCard & {
  context: string;
  responsibilities: string[];
  challenges?: string[];
};

const details: Record<ProjectSlug, Omit<ProjectDetail, keyof ProjectCard>> = {
  "dapp-multichain": {
    context:
      "面向多链生态的产品矩阵，需要统一交互范式并支持不同协议的钱包与合约调用差异。",
    responsibilities: [
      "主导多条链上产品的界面与业务模块实现",
      "Ethereum / Berachain 等场景下的合约读写与状态管理",
      "优惠券系统：配置、核销与活动运营，辅助 DApp 推广",
      "搭建内部公共组件库，统一交互并缩短迭代周期",
    ],
    challenges: [
      "多协议 ABI、交易确认与错误态的用户可理解反馈",
      "在快速迭代中保持组件 API 稳定与可测试性",
    ],
  },
  "official-site": {
    context:
      "旧版 Next.js 存在安全与维护风险，同时公司需要更强的内容发布与品牌检索能力。",
    responsibilities: [
      "升级并重构官网技术栈与信息架构",
      "新增 Blog、News、Events 等内容模块",
      "为关键页面配置动态 Meta 与基础 SEO，提升活动与文章在搜索引擎中的可见度",
      "强化交互体验与多端适配",
    ],
  },
  "cloud-platform": {
    context:
      "一站式区块链基础设施平台，涵盖节点、链上数据 API 与资源监控。",
    responsibilities: [
      "Node：配置、启动、resize、upgrade、终端等运维向能力的前端呈现",
      "API Project：订阅、IP 白名单、鉴权与用量分析可视化",
      "Block Watch：资源监控与电话 / 邮件告警分配",
      "组织权限、支付与订单查询等通用能力的前端实现",
      "BFF 侧脚本配合订单状态，支持按月自动续费相关流程",
    ],
  },
  "dept-performance": {
    context:
      "部门多项目共用公司自研框架，首屏与包体问题影响交付效率。",
    responsibilities: [
      "使用 webpack-bundle-analyzer 梳理各项目打包构成",
      "分析首屏请求，减少冗余或通过缓存加速",
      "阅读框架源码，协助同事解决框架使用与扩展问题",
    ],
  },
  "scheduling-gantt": {
    context:
      "智能排程结果需以甘特图呈现，并支持拖拽驱动后台改期。",
    responsibilities: [
      "在缺少合适开源组件的前提下，自研甘特渲染与交互层",
    ],
    challenges: [
      "采用双层 Canvas：底层绘制坐标与表格，上层绘制排程条并处理拖拽命中",
    ],
  },
  "iot-nodered": {
    context:
      "node-red 作为低代码流编辑器，需要沉淀业务可复用节点以对接 IoT 与 HTTP/WebSocket。",
    responsibilities: [
      "学习并扩展编辑器侧组件",
      "将业务逻辑拆分为可选基础组件，便于客户按需拼装",
    ],
  },
};

export function getProjectDetail(slug: ProjectSlug): ProjectDetail {
  const card = projectCards.find((p) => p.slug === slug);
  if (!card) throw new Error(`Unknown slug: ${slug}`);
  const extra = details[slug];
  return { ...card, ...extra };
}

export function getAllProjectSlugs(): ProjectSlug[] {
  return projectCards.map((p) => p.slug);
}
