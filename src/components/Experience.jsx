import { practicalExperience } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" className="section-wrap experience-section" aria-labelledby="experience-heading">
      <div className="section-kicker">
        <span>05</span>
        <span>practical experience</span>
      </div>

      <div className="experience-grid">
        <div className="experience-intro">
          <h2 id="experience-heading">Learning by<br /><em>shipping.</em></h2>
          <p>
            My experience so far is built through coursework, technical projects, labs, and the discipline of
            figuring out what happens when things do not work.
          </p>
        </div>

        <div className="experience-items" role="list" aria-label="Practical experience areas">
          {practicalExperience.map((item) => (
            <div key={item.id} className="experience-item" role="listitem">
              <span className="experience-number">{item.number}</span>
              <div className="experience-content">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <ul className="experience-highlights">
                  {item.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}