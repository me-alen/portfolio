"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectItem } from "../data/portfolio";

type ProjectsSectionProps = {
  companyProjects: ProjectItem[];
  personalProjects: ProjectItem[];
  clientProjects: ProjectItem[];
  funProjects: ProjectItem[];
};

const projectGroups = [
  {
    label: "Company Projects",
    key: "company",
  },
  {
    label: "Personal Projects",
    key: "personal",
  },
  {
    label: "Client Projects",
    key: "client",
  },
  {
    label: "Fun Projects",
    key: "fun",
  },
] as const;

export default function ProjectsSection({
  companyProjects,
  personalProjects,
  clientProjects,
  funProjects,
}: ProjectsSectionProps) {
  const [activeGroup, setActiveGroup] = useState<
    (typeof projectGroups)[number]["key"]
  >("company");
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) {
        clearTimeout(switchTimerRef.current);
      }
    };
  }, []);

  const handleGroupChange = (nextGroup: (typeof projectGroups)[number]["key"]) => {
    if (nextGroup === activeGroup || isSwitching) {
      return;
    }

    setIsSwitching(true);

    if (switchTimerRef.current) {
      clearTimeout(switchTimerRef.current);
    }

    switchTimerRef.current = setTimeout(() => {
      setActiveGroup(nextGroup);
      requestAnimationFrame(() => {
        setIsSwitching(false);
      });
    }, 170);
  };

  const visibleProjects =
    activeGroup === "company"
      ? companyProjects
      : activeGroup === "personal"
        ? personalProjects
        : activeGroup === "client"
          ? clientProjects
          : funProjects;

  return (
    <section id="projects" className="mb-14 sm:mb-20">
      <h2 className="mb-5 text-xl font-semibold sm:mb-6 sm:text-2xl">
        Projects
      </h2>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:mb-6">
        {projectGroups.map((group) => {
          const isActive = activeGroup === group.key;
          return (
            <button
              key={group.key}
              type="button"
              onClick={() => handleGroupChange(group.key)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                isActive
                  ? "border-indigo-500 bg-indigo-500 text-white"
                  : "border-[var(--border-color)] text-[var(--soft-foreground)] hover:border-[var(--subtle-foreground)]"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      <div
        className={`grid gap-4 transition-all duration-200 ease-out sm:gap-6 ${
          isSwitching ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {visibleProjects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <h3 className="text-lg font-semibold sm:text-xl">{project.title}</h3>
              <p className="text-sm text-[var(--subtle-foreground)]">{project.period}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)] sm:text-base sm:leading-8">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--chip-bg)] px-2.5 py-1 text-[11px] text-[var(--soft-foreground)] sm:px-3 sm:text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
            {project.githubUrl || project.liveUrl ? (
              <div className="mt-4 flex flex-wrap gap-4">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    Live site
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    View repo
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--subtle-foreground)]">
          No projects added in this section yet.
        </p>
      ) : null}
    </section>
  );
}
