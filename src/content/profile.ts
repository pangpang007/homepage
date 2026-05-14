export const profile = {
  name: "刘岩",
  role: "前端开发工程师",
  tagline:
    "11 年经验 · React / Next.js · Web3 DApp · 企业级云平台与多端交付",
  location: "北京",
  intent: "前端开发工程师",
  salaryRange: "25–35K",
  years: 11,
  summary:
    "有多端开发经验，涉足零售、生产制造与物流等行业；热衷于学习新技术，工作认真，善于规划与推进。近年聚焦 Next.js 官网与 SEO、React 核心产品、Express BFF，以及多链 DApp 与智能合约交互。",
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "SEO / Meta",
    "Express / BFF",
    "Web3 / DApp",
    "Ethers / 合约交互",
    "WebSocket",
    "性能优化",
    "Ant Design",
    "微信小程序",
    "React Native",
    "Hybrid App",
    "node-red / IoT",
    "Tailwind CSS",
  ],
  links: {
    /** 在 .env.local 中设置 NEXT_PUBLIC_GITHUB_URL 后显示 */
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
    /** 简历 PDF 放入 public/resume.pdf 后生效 */
    resumePath: "/resume.pdf",
  },
  contact: {
    email: "929736812@qq.com",
    /** 公开页不展示完整手机号，完整信息见简历 PDF */
    phoneHint: "可向招聘方提供完整简历与联系方式",
  },
  experience: [
    {
      company: "北京磐沄科技有限公司",
      title: "前端开发工程师",
      range: "2022.05 – 2026.03",
      highlights: [
        "基于 Next.js 搭建公司官网，落地 SEO（含动态 Meta），支撑 Blog / News / Events 等内容渠道",
        "主导 Next.js 升级与官网重构，处理安全与体验，强化多端适配",
        "React 核心产品与 Express BFF，高效对接链上 / 订阅与订单场景",
        "多协议 DApp（Ethereum、Berachain、Carv、Cysic 等）、合约交互、优惠券体系；建设内部公共组件库",
      ],
    },
    {
      company: "用友网络科技股份有限公司",
      title: "前端开发",
      range: "2019.11 – 2022.05",
      highlights: [
        "部门前端对接人：推进性能优化（打包分析、请求与缓存），阅读框架源码解决共性问题",
        "交付 PC Web、Hybrid App、React（antd）、微信小程序（vant）、React Native、Kotlin 安卓等",
        "node-red + IoT 无人值守自助机；复杂业务场景的组件化与可维护性",
        "WebSocket 单例与断线重连；RTSP 经自建 Node 服务转 WebSocket 的视频展示方案",
      ],
    },
    {
      company: "北京衣念科技发展有限公司",
      title: "Web 前端",
      range: "2015.07 – 2019.10",
      highlights: [
        "React + ant design + axios：团购审批等管理端",
        "微信小程序：POS 销售、退货、促销与积分等",
        "Ionic + Cordova 百货 PDA POS，对接多银联渠道",
        "jQuery + Bootstrap + jqgrid：库存与状态机业务",
      ],
    },
  ],
  education: {
    school: "太原理工大学",
    major: "软件工程",
    degree: "本科",
    range: "2011 – 2015",
  },
} as const;
