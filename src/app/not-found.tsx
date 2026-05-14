import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-web3-mesh flex min-h-full flex-col items-center justify-center px-4 py-24">
      <h1 className="font-display text-4xl font-bold text-fg">404</h1>
      <p className="mt-4 text-center text-fg-muted">页面不存在或已移动。</p>
      <Link
        href="/"
        className="focus-ring mt-8 cursor-pointer rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-soft"
      >
        返回首页
      </Link>
    </div>
  );
}
