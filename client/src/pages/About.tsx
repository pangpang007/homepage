import styles from "./About.module.css";

export function About() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>关于</h1>
      <p className={styles.p}>
        你可以在这里写简介、项目链接或联系方式。结构已按 React Router 嵌套路由搭好，按需增删页面即可。
      </p>
      <ul className={styles.list}>
        <li>
          <strong>前端</strong>：<code className={styles.code}>client/</code>，Vite + React +
          React Router
        </li>
        <li>
          <strong>BFF</strong>：<code className={styles.code}>server/</code>，Express 将{" "}
          <code className={styles.code}>/api</code> 代理到环境变量中的后端地址
        </li>
        <li>
          <strong>后端</strong>：独立部署在 Vercel，由 BFF 转发，避免浏览器直连跨域问题
        </li>
      </ul>
    </div>
  );
}
