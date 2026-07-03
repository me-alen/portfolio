import { cookies } from "next/headers";
import PortfolioClient from "./components/PortfolioClient";
import {
  companyProjects,
  contact,
  clientProjects,
  education,
  experience,
  funProjects,
  languages,
  personalProjects,
  profile,
  skills,
} from "./data/portfolio";
import { DEFAULT_STYLE, STYLE_COOKIE, type PortfolioStyle } from "./styleConfig";

export default async function Home() {
  const cookieStore = await cookies();
  const storedStyle = cookieStore.get(STYLE_COOKIE)?.value;
  const hasChoice = storedStyle === "style-1" || storedStyle === "style-2";
  const initialStyle: PortfolioStyle = hasChoice
    ? (storedStyle as PortfolioStyle)
    : DEFAULT_STYLE;

  return (
    <PortfolioClient
      initialStyle={initialStyle}
      showIntro={!hasChoice}
      profile={profile}
      skills={skills}
      languages={languages}
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
