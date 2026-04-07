import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

type HelloState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; text: string; httpStatus: number }
  | { status: "error"; message: string };

/**
 * 点击按钮请求 `/api/hello`：BFF 转发到配置的后端 `GET /hello`，用于验证前后端链路。
 */
export function Home() {
  const [hello, setHello] = useState<HelloState>({ status: "idle" });

  const testBackendHello = useCallback(() => {
    setHello({ status: "loading" });
    fetch("/api/hello")
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}：${text.slice(0, 200)}`);
        }
        setHello({ status: "ok", text, httpStatus: res.status });
      })
      .catch((e: Error) => {
        setHello({
          status: "error",
          message: e.message || "请求失败",
        });
      });
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>你好，我是 Soupcircle</h1>
      <p className={styles.lead}>
        这是个人主页的前端：React + React Router。接口经 Express BFF 访问远端服务（默认{" "}
        <code className={styles.code}>soupcircle-backend.vercel.app</code>
        ）。
      </p>
      <section className={styles.card} aria-label="前后端连通测试">
        <h2 className={styles.cardTitle}>前后端连通测试</h2>
        <p className={styles.cardDesc}>
          点击下方按钮会请求{" "}
          <code className={styles.code}>/api/hello</code>，由 BFF 调用远端{" "}
          <code className={styles.code}>GET /hello</code>
          ，预期返回纯文本 <code className={styles.code}>hello world</code>
          （请在后端实现该接口）。
        </p>
        <button
          type="button"
          className={styles.button}
          onClick={testBackendHello}
          disabled={hello.status === "loading"}
        >
          {hello.status === "loading" ? "请求中…" : "调用后端 /hello"}
        </button>
        {hello.status === "ok" && (
          <div className={styles.resultBlock}>
            <p className={styles.resultMeta}>HTTP {hello.httpStatus}</p>
            <pre className={styles.resultPre} aria-live="polite">
              {hello.text}
            </pre>
          </div>
        )}
        {hello.status === "error" && (
          <p className={styles.error} role="alert">
            {hello.message}
          </p>
        )}
      </section>
      <p className={styles.cta}>
        <Link to="/about">了解更多 →</Link>
      </p>
    </div>
  );
}
