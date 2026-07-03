type Stat = {
  value: string;
  label: string;
};

type Style2HeroProps = {
  firstName: string;
  lastName: string;
  role: string;
  intro: string;
  stats: Stat[];
};

export default function Style2Hero({
  firstName,
  lastName,
  role,
  intro,
  stats,
}: Style2HeroProps) {
  return (
    <section className="style2-hero" id="home">
      <div className="style2-hero-left">
        <div className="style2-hero-tag">
          Available for frontend and fullstack roles · Kochi · Remote
        </div>
        <h1 className="style2-hero-name">
          <span>{firstName}</span>
          <span className="style2-outline">
            {lastName}
            <span className="style2-accent">.</span>
          </span>
        </h1>
        <p className="style2-hero-role">{role}</p>
        <p className="style2-hero-desc">{intro}</p>
        <div className="style2-hero-cta">
          <a className="style2-btn-primary" href="#contact">
            Get in touch
          </a>
          <a className="style2-btn-outline" href="#projects">
            View work
          </a>
        </div>
      </div>

      <div className="style2-hero-right" aria-label="Portfolio stats">
        {stats.map((stat) => (
          <article className="style2-stat-card" key={stat.label}>
            <div className="style2-stat-num">{stat.value}</div>
            <div className="style2-stat-label">{stat.label}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
