import Link from "next/link";
import { GitHubIcon } from "@/components/GitHubIcon";
import { profile } from "@/content/profile";
import { CopyEmailButton } from "@/components/CopyEmailButton";

export function Footer() {
  const hasGithub = Boolean(profile.links.github);
  return (
    <footer
      id="contact"
      className="scroll-mt-28 border-t border-accent/20 bg-[color-mix(in_srgb,var(--bg-root)_92%,#1e1b4b)] py-16 sm:scroll-mt-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">
          联系
        </h2>
        <p className="mt-2 max-w-xl text-fg-muted">{profile.contact.phoneHint}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CopyEmailButton email={profile.contact.email} />
          <a
            href={`mailto:${profile.contact.email}`}
            className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong/80 px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
          >
            发送邮件
          </a>
          {hasGithub ? (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong/80 px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
          ) : null}
        </div>
        <p className="mt-10 text-center text-xs text-fg-muted sm:text-left">
          © {new Date().getFullYear()} {profile.name} ·{" "}
          <Link
            href="#top"
            className="cursor-pointer underline-offset-4 hover:text-accent-soft hover:underline"
          >
            回到顶部
          </Link>
        </p>
      </div>
    </footer>
  );
}
