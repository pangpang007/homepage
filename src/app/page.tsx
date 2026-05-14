import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { SkillChips } from "@/components/SkillChips";
import { ProjectCard } from "@/components/ProjectCard";
import { Timeline } from "@/components/Timeline";
import { Education } from "@/components/Education";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { projectCards } from "@/content/projects";

export default function Home() {
  return (
    <div className="bg-web3-mesh min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-8 pt-24 sm:px-6 sm:pt-28">
        <Reveal>
          <Hero />
        </Reveal>
        <Reveal className="delay-75">
          <SkillChips />
        </Reveal>
        <section
          id="work"
          className="scroll-mt-28 pt-20 sm:scroll-mt-32 sm:pt-28"
          aria-labelledby="work-heading"
        >
          <h2
            id="work-heading"
            className="font-display text-2xl font-bold text-fg sm:text-3xl"
          >
            精选项目
          </h2>
          <p className="mt-2 max-w-2xl text-fg-muted">
            点击卡片进入案例页，了解背景、职责与技术难点。
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projectCards.map((project) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
        <Reveal>
          <Timeline />
        </Reveal>
        <Reveal>
          <Education />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
