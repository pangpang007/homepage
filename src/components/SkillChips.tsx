import { profile } from "@/content/profile";

export function SkillChips() {
  return (
    <section
      id="skills"
      className="scroll-mt-28 pt-20 sm:scroll-mt-32 sm:pt-28"
      aria-labelledby="skills-heading"
    >
      <h2
        id="skills-heading"
        className="font-display text-2xl font-bold text-fg sm:text-3xl"
      >
        技术栈与能力
      </h2>
      <p className="mt-2 max-w-2xl text-fg-muted">
        覆盖 Web、移动端、IoT 与 Web3；以下为常用关键词，详情见项目与经历。
      </p>
      <ul className="mt-8 flex flex-wrap gap-2">
        {profile.skills.map((skill) => (
          <li key={skill}>
            <span className="inline-flex cursor-default rounded-lg border border-accent/25 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-soft transition-colors duration-200 hover:border-accent/50 hover:bg-accent/15">
              {skill}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
