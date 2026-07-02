import { randomInt } from "crypto";
import PortfolioStyleOne from "./components/PortfolioStyleOne";
import PortfolioStyleTwo from "./components/PortfolioStyleTwo";
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

export const dynamic = "force-dynamic";

function pickPortfolioStyle() {
  return randomInt(2) === 0 ? "style-1" : "style-2";
}

export default function Home() {
  const style = pickPortfolioStyle();
  const sharedProps = {
    profile,
    skills,
    education,
    experience,
    companyProjects,
    personalProjects,
    clientProjects,
    funProjects,
    contact,
  };

  if (style === "style-2") {
    return (
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
    );
  }

  return <PortfolioStyleOne {...sharedProps} />;
}
