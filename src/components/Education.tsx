import { profile } from "@/content/profile";

export function Education() {
  const e = profile.education;
  return (
    <section
      id="education"
      className="scroll-mt-28 pt-20 sm:scroll-mt-32 sm:pt-28"
      aria-labelledby="edu-heading"
    >
      <h2
        id="edu-heading"
        className="font-display text-2xl font-bold text-fg sm:text-3xl"
      >
        教育经历
      </h2>
      <div className="glass-card mt-8 max-w-xl rounded-2xl p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-fg">{e.school}</h3>
        <p className="mt-1 text-accent-soft">
          {e.major} · {e.degree}
        </p>
        <p className="mt-2 text-sm text-fg-muted">{e.range}</p>
      </div>
    </section>
  );
}
