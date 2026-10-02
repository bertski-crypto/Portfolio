import { motion } from 'framer-motion';
import { practicalExperience } from '../data/experience';
import { Timeline, TimelineNode, TimelineRail } from './Timeline';
import {
  Reveal,
  SectionHeader,
  SectionTitle,
  Stagger,
  StaggerItem,
  hoverCard,
  tapSoft,
} from '../utils/motion-primitives';
import '../styles/components/bento.css';

export default function Experience() {
  return (
    <section
      id="experience"
      className="experience section-wrap"
      aria-labelledby="experience-heading"
    >
      <SectionHeader className="section-header">
        <SectionTitle num="05" kicker="practical experience" id="experience-heading">
          Learning by
          <br />
          <em>shipping.</em>
        </SectionTitle>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          My experience so far is built through coursework, technical projects,
          labs, and the discipline of figuring out what happens when things do
          not work.
        </Reveal>
      </SectionHeader>

      <Timeline>
        <Stagger className="experience-grid timeline" gap={0.12}>
          <TimelineRail />
          {practicalExperience.map((item, i) => (
            <StaggerItem
              key={item.id}
              as="article"
              className="experience-card-slot timeline-item"
              parallax
              parallaxIndex={i}
            >
              <TimelineNode />
              <motion.div
                className="experience-card glass-card"
                role="listitem"
                whileHover={hoverCard}
                whileTap={tapSoft}
              >
                <span className="experience-number">{item.number}</span>

                <div className="experience-content">
                  <h3 className="experience-title">{item.title}</h3>
                  <p className="experience-desc">{item.description}</p>
                  <ul className="experience-highlights">
                    {item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </Timeline>
    </section>
  );
}