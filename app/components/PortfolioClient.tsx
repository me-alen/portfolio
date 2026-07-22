"use client";

import { useEffect, useRef, useState } from "react";

import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../data/portfolio";
import GameOverlay from "./GameOverlay";
import PortfolioStyleOne from "./PortfolioStyleOne";
import PortfolioStyleTwo from "./PortfolioStyleTwo";
import PortfolioStyleThree from "./PortfolioStyleThree";
import PortfolioStyleFour from "./PortfolioStyleFour";
import PortfolioStyleFive from "./PortfolioStyleFive";
import PortfolioStyleSix from "./PortfolioStyleSix";
import PortfolioStyleSeven from "./PortfolioStyleSeven";
import PortfolioStyleEight from "./PortfolioStyleEight";
import PortfolioStyleNine from "./PortfolioStyleNine";
import PortfolioStyleTen from "./PortfolioStyleTen";
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
  const [gameOpen, setGameOpen] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The playable game popup reuses the live deployment already listed in the
  // fun-projects data, so the URL has a single source of truth.
  const pourAnOcean = funProjects.find((project) => project.title === "Pour an Ocean");
  const pourAnOceanUrl = pourAnOcean?.liveUrl ?? "https://pour-an-ocean.vercel.app";

  useEffect(() => {
    return () => {
      if (swapTimer.current) {
        clearTimeout(swapTimer.current);
      }
    };
  }, []);

  // Expose the active style to elements outside this tree (e.g. the floating
  // resume button in the root layout) so they can adapt their colors.
  useEffect(() => {
    document.documentElement.dataset.portfolioStyle = displayStyle;
  }, [displayStyle]);


  const projectGroups = [
    { label: "Company Projects", projects: companyProjects },
    { label: "Personal Projects", projects: personalProjects },
    { label: "Client Projects", projects: clientProjects },
    { label: "Fun Projects", projects: funProjects },
  ];

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
        {(() => {
          const pageProps = {
            profile,
            skills,
            languages,
            education,
            experience,
            projectGroups,
            contact,
          };

          switch (displayStyle) {
            case "style-2":
              return <PortfolioStyleTwo {...pageProps} />;
            case "style-3":
              return <PortfolioStyleThree {...pageProps} />;
            case "style-4":
              return <PortfolioStyleFour {...pageProps} />;
            case "style-5":
              return <PortfolioStyleFive {...pageProps} />;
            case "style-6":
              return <PortfolioStyleSix {...pageProps} />;
            case "style-7":
              return <PortfolioStyleSeven {...pageProps} />;
            case "style-8":
              return <PortfolioStyleEight {...pageProps} />;
            case "style-9":
              return <PortfolioStyleNine {...pageProps} />;
            case "style-10":
              return <PortfolioStyleTen {...pageProps} />;
            default:
              return (
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
              );
          }
        })()}
      </div>
      <StyleSwitcher
        initials={getInitials(profile.name)}
        currentStyle={style}
        onSelect={selectStyle}
        onPlayGame={() => setGameOpen(true)}
      />
      {introOpen ? (
        <StyleIntroOverlay
          onSelect={selectStyle}
          onClose={() => setIntroOpen(false)}
          onPlayGame={() => setGameOpen(true)}
        />
      ) : null}
      {gameOpen ? (
        <GameOverlay
          title="Pour an Ocean"
          url={pourAnOceanUrl}
          onClose={() => setGameOpen(false)}
        />
      ) : null}
    </>
  );
}
