import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.less";
import { encryptPasswordForTransport } from "@/utils/passwordTransfer";

type Mode = "login" | "register";
type SubmitState = "idle" | "submitting";

export function Admin() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  const transferKey = useMemo(
    () => import.meta.env.VITE_PASSWORD_TRANSFER_KEY?.trim() ?? "",
    []
  );

  const refreshSession = useCallback(async () => {
    const res = await fetch("/api/admin/session", { credentials: "include" });
    const data = (await res.json()) as { authenticated?: boolean };
    setAuthenticated(Boolean(data.authenticated));
  }, []);

  useEffect(() => {
    refreshSession().catch(() => setAuthenticated(false));
  }, [refreshSession]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setMessage("");
      setSubmitState("submitting");
      try {
        const encryptedPassword = await encryptPasswordForTransport(
          password,
          transferKey
        );
        const url =
          mode === "login" ? "/api/admin/login" : "/api/admin/register";
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password: encryptedPassword }),
        });
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || `HTTP ${res.status}`);
        }

        if (mode === "login") {
          setMessage("登录成功，token 已存入 HttpOnly Cookie。");
          await refreshSession();
        } else {
          setMessage("注册成功，请切换到登录。");
        }
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "请求失败");
      } finally {
        setSubmitState("idle");
      }
    },
    [email, mode, password, refreshSession, transferKey]
  );

  const onLogout = useCallback(async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    await refreshSession();
    setMessage("已登出。");
  }, [refreshSession]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin 管理后台</h1>
      <p className={styles.desc}>
        当前会话：{authenticated === null ? "检测中..." : authenticated ? "已登录" : "未登录"}
      </p>

      {!transferKey && (
        <p className={styles.error}>
          缺少 <code className={styles.code}>VITE_PASSWORD_TRANSFER_KEY</code>，
          无法按后端协议加密密码。
        </p>
      )}

      <div className={styles.switcher}>
        <button
          type="button"
          className={mode === "login" ? styles.activeTab : styles.tab}
          onClick={() => setMode("login")}
        >
          登录
        </button>
        <button
          type="button"
          className={mode === "register" ? styles.activeTab : styles.tab}
          onClick={() => setMode("register")}
        >
          注册
        </button>
        <button type="button" className={styles.logout} onClick={onLogout}>
          登出
        </button>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.label}>
          邮箱
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@qq.com"
            required
          />
        </label>

        <label className={styles.label}>
          密码
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        <button
          className={styles.submit}
          type="submit"
          disabled={submitState === "submitting" || !transferKey}
        >
          {submitState === "submitting"
            ? "提交中..."
            : mode === "login"
              ? "登录"
              : "注册"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
