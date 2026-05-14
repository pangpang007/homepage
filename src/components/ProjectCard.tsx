import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectCard as ProjectCardType } from "@/content/projects";

type Props = {
  project: ProjectCardType;
};

export function ProjectCard({ project }: Props) {
  return (
    <article className="glass-card group flex h-full flex-col rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gold">
            {project.period}
          </p>
          <h3 className="font-display mt-1 text-lg font-bold text-fg sm:text-xl">
            {project.title}
          </h3>
        </div>
        <Link
          href={`/work/${project.slug}`}
          className="focus-ring text-accent-soft hover:text-gold cursor-pointer rounded-lg p-1 transition-colors duration-200"
          aria-label={`查看「${project.title}」详情`}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted sm:text-base">
        {project.summary}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <li
            key={s}
            className="rounded-md border border-border-strong/40 px-2 py-0.5 text-xs text-fg-muted"
          >
            {s}
          </li>
        ))}
      </ul>
      <Link
        href={`/work/${project.slug}`}
        className="focus-ring mt-5 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-soft"
      >
        查看案例
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
    </article>
  );
}
