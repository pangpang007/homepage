import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import { profile } from "@/content/profile";

export function Hero() {
  const hasGithub = Boolean(profile.links.github);
  return (
    <section
      id="top"
      className="scroll-mt-28 pt-4 sm:scroll-mt-32 sm:pt-8"
      aria-labelledby="hero-title"
    >
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft sm:text-sm">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_10px_rgba(251,191,36,0.85)]" />
        {profile.location} · {profile.intent} · 期望 {profile.salaryRange}
      </p>
      <h1
        id="hero-title"
        className="font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl md:text-6xl"
      >
        {profile.name}
      </h1>
      <p className="mt-2 font-display text-lg text-accent-soft sm:text-xl md:text-2xl">
        {profile.role}
      </p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
        {profile.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">
        {profile.summary}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="#contact"
          className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] transition-all duration-200 hover:bg-accent-soft hover:shadow-[0_0_28px_rgba(167,139,250,0.45)]"
        >
          联系我
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={profile.links.resumePath}
          className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong/80 bg-elevated/50 px-5 py-3 text-sm font-semibold text-fg transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
        >
          <FileText className="h-4 w-4" aria-hidden />
          下载简历 PDF
        </Link>
        {hasGithub ? (
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong/80 bg-elevated/50 px-5 py-3 text-sm font-semibold text-fg transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </a>
        ) : null}
      </div>
    </section>
  );
}
