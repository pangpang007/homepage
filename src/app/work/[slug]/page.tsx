import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getAllProjectSlugs,
  getProjectDetail,
  type ProjectSlug,
} from "@/content/projects";
import { SiteHeader } from "@/components/SiteHeader";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isProjectSlug(slug)) return { title: "未找到" };
  const p = getProjectDetail(slug);
  return {
    title: p.title,
    description: p.summary,
    openGraph: {
      title: p.title,
      description: p.summary,
    },
  };
}

function isProjectSlug(s: string): s is ProjectSlug {
  return getAllProjectSlugs().includes(s as ProjectSlug);
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  if (!isProjectSlug(slug)) notFound();
  const p = getProjectDetail(slug);

  return (
    <div className="bg-web3-mesh min-h-full">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <Link
          href="/#work"
          className="focus-ring inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-accent-soft transition-colors duration-200 hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          返回项目列表
        </Link>
        <p className="mt-8 text-sm font-medium uppercase tracking-wider text-gold">
          {p.period}
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold leading-tight text-fg sm:text-4xl">
          {p.title}
        </h1>
        <p className="mt-4 text-lg text-fg-muted">{p.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <li
              key={s}
              className="rounded-md border border-border-strong/50 px-2.5 py-1 text-xs font-medium text-accent-soft"
            >
              {s}
            </li>
          ))}
        </ul>
        <div className="glass-card mt-10 rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-fg">背景</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">{p.context}</p>
          <h2 className="font-display mt-8 text-lg font-bold text-fg">职责与产出</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-fg-muted marker:text-accent">
            {p.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          {p.challenges?.length ? (
            <>
              <h2 className="font-display mt-8 text-lg font-bold text-fg">难点</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-fg-muted marker:text-gold">
                {p.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </article>
    </div>
  );
}
