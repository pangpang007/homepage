import { profile } from "@/content/profile";

export function Timeline() {
  return (
    <section
      id="experience"
      className="scroll-mt-28 pt-20 sm:scroll-mt-32 sm:pt-28"
      aria-labelledby="exp-heading"
    >
      <h2
        id="exp-heading"
        className="font-display text-2xl font-bold text-fg sm:text-3xl"
      >
        工作经历
      </h2>
      <p className="mt-2 text-fg-muted">
        {profile.years}+ 年一线交付与协作经验（节选要点）。
      </p>
      <ol className="relative mt-12 space-y-12 border-l border-accent/30 pl-8 sm:pl-10">
        {profile.experience.map((job) => (
          <li key={job.company} className="relative">
            <span
              className="absolute -left-[calc(0.5rem+1px)] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-root shadow-[0_0_12px_rgba(139,92,246,0.7)] sm:h-3.5 sm:w-3.5"
              aria-hidden
            />
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-fg sm:text-xl">
                  {job.company}
                </h3>
                <time className="text-sm text-gold">{job.range}</time>
              </div>
              <p className="mt-1 text-sm font-medium text-accent-soft">
                {job.title}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-fg-muted marker:text-accent sm:text-base">
                {job.highlights.map((line, idx) => (
                  <li key={`${job.company}-${idx}`}>{line}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
