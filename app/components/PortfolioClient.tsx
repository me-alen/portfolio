"use client";

import { useEffect, useRef, useState } from "react";

import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../data/portfolio";
import PortfolioStyleOne from "./PortfolioStyleOne";
import PortfolioStyleTwo from "./PortfolioStyleTwo";
import StyleIntroOverlay from "./StyleIntroOverlay";
import StyleSwitcher from "./StyleSwitcher";
import { getInitials } from "./style-two/helpers";
import { STYLE_COOKIE, STYLE_COOKIE_MAX_AGE } from "../styleConfig";
import type { PortfolioStyle } from "../styleConfig";

const PAGE_FADE_MS = 260;

type Profile = {
  name: string;
  role: string;
  intro: string;
  about: string;
};

type Contact = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
};

type PortfolioClientProps = {
  initialStyle: PortfolioStyle;
  showIntro: boolean;
  profile: Profile;
  skills: string[];
  languages: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  companyProjects: ProjectItem[];
  personalProjects: ProjectItem[];
  clientProjects: ProjectItem[];
  funProjects: ProjectItem[];
  contact: Contact;
};

export default function PortfolioClient({
  initialStyle,
  showIntro,
  profile,
  skills,
  languages,
  education,
  experience,
  companyProjects,
  personalProjects,
  clientProjects,
  funProjects,
  contact,
}: PortfolioClientProps) {
  const [style, setStyle] = useState<PortfolioStyle>(initialStyle);
  const [displayStyle, setDisplayStyle] = useState<PortfolioStyle>(initialStyle);
  const [pageVisible, setPageVisible] = useState(true);
  const [introOpen, setIntroOpen] = useState(showIntro);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (swapTimer.current) {
        clearTimeout(swapTimer.current);
      }
    };
  }, []);

  const selectStyle = (next: PortfolioStyle) => {
    setStyle(next);
    document.cookie = `${STYLE_COOKIE}=${next}; path=/; max-age=${STYLE_COOKIE_MAX_AGE}; samesite=lax`;

    if (next === displayStyle) {
      return;
    }

    if (swapTimer.current) {
      clearTimeout(swapTimer.current);
    }
    setPageVisible(false);
    swapTimer.current = setTimeout(() => {
      setDisplayStyle(next);
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => setPageVisible(true));
    }, PAGE_FADE_MS);
  };

  return (
    <>
      <div
        style={{
          opacity: pageVisible ? 1 : 0,
          transition: `opacity ${PAGE_FADE_MS}ms ease`,
        }}
      >
        {displayStyle === "style-2" ? (
          <PortfolioStyleTwo
            profile={profile}
            skills={skills}
            languages={languages}
            education={education}
            experience={experience}
            projectGroups={[
              { label: "Company Projects", projects: companyProjects },
              { label: "Personal Projects", projects: personalProjects },
              { label: "Client Projects", projects: clientProjects },
              { label: "Fun Projects", projects: funProjects },
            ]}
            contact={contact}
          />
        ) : (
          <PortfolioStyleOne
            profile={profile}
            skills={skills}
            education={education}
            experience={experience}
            companyProjects={companyProjects}
            personalProjects={personalProjects}
            clientProjects={clientProjects}
            funProjects={funProjects}
            contact={contact}
          />
        )}
      </div>
      <StyleSwitcher
        initials={getInitials(profile.name)}
        currentStyle={style}
        onSelect={selectStyle}
      />
      {introOpen ? (
        <StyleIntroOverlay
          onSelect={selectStyle}
          onClose={() => setIntroOpen(false)}
        />
      ) : null}
    </>
  );
}
