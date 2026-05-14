import Link from "next/link";

const nav = [
  { href: "#top", label: "首页" },
  { href: "#skills", label: "能力" },
  { href: "#work", label: "项目" },
  { href: "#experience", label: "经历" },
  { href: "#education", label: "教育" },
  { href: "#contact", label: "联系" },
];

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <nav
        className="glass-nav pointer-events-auto flex max-w-6xl flex-1 items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:px-5"
        aria-label="主导航"
      >
        <Link
          href="#top"
          className="font-display text-sm font-semibold tracking-wide text-gold focus-ring shrink-0 rounded-md sm:text-base"
        >
          LY
        </Link>
        <ul className="flex max-w-[min(100%,28rem)] flex-1 flex-wrap justify-end gap-x-3 gap-y-1 text-sm sm:max-w-none sm:gap-x-5 sm:text-[0.9375rem]">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-fg-muted hover:text-accent-soft focus-ring cursor-pointer rounded-md font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
