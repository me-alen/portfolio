export default function Style2Marquee({ skills }: { skills: string[] }) {
  const marqueeSkills = [...skills, ...skills];

  return (
    <div className="style2-marquee-section" aria-hidden="true">
      <div className="style2-marquee-track">
        {marqueeSkills.map((skill, index) => (
          <span key={`${skill}-${index}`}>
            {skill}
            <span className="style2-dot"> / </span>
          </span>
        ))}
      </div>
    </div>
  );
}
