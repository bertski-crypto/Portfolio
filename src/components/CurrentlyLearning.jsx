import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, Clock, Check } from 'lucide-react';

import { currentlyLearning } from '../data/experience';
import {
  Reveal,
  SectionHeader,
  Stagger,
  StaggerItem,
  hoverCard,
  hoverIconPop,
  tapSoft,
} from '../utils/motion-primitives';
import '../styles/components/learning.css';

const statusIcons = {
  'COMPLETED': Check,
  'IN PROGRESS': TrendingUp,
  'LEARNING': BookOpen,
  'EXPLORING': Target,
  'PLANNED': Clock,
};

const statusTone = {
  'COMPLETED': 'ok',
  'IN PROGRESS': 'info',
  'LEARNING': 'warn',
  'EXPLORING': 'info',
  'PLANNED': 'muted',
};

function LearningCard({ item }) {
  const Icon = statusIcons[item.status] || BookOpen;
  const tone = statusTone[item.status] || 'muted';

  return (
    <article className="learning-slot">
      <motion.div
        className="learning-card glass-card"
        role="listitem"
        whileHover={hoverCard}
        whileTap={tapSoft}
      >
        <motion.div
          className={`learning-icon learning-icon--${tone}`}
          aria-hidden="true"
          whileHover={hoverIconPop(1.08, -2)}
        >
          <Icon size={20} />
        </motion.div>

        <h3 className="learning-topic">{item.topic}</h3>

        <span className={`badge badge--${tone} learning-status`}>{item.status}</span>

        {item.resources?.length > 0 && (
          <div className="learning-resources">
            <h4>Resources</h4>
            <ul>
              {item.resources.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </article>
  );
}

export default function CurrentlyLearning() {
  return (
    <section
      id="learning"
      className="learning section-wrap"
      aria-labelledby="learning-heading"
    >
      <SectionHeader className="section-header">
        <Reveal kind="heading" as="div">
          <div className="kicker">
            <span>07</span>
            <span>currently learning</span>
          </div>
          <h2 id="learning-heading" className="heading-lg">
            Always
            <br />
            <em>learning.</em>
          </h2>
        </Reveal>
        <Reveal kind="lead" as="p" delay={0.08} className="muted">
          These are the topics I'm actively exploring, developing, or planning to
          study next. Status labels reflect current progress honestly.
        </Reveal>
      </SectionHeader>

      <Stagger className="learning-grid" gap={0.1} role="list">
        {currentlyLearning.map((item) => (
          <StaggerItem key={item.topic} className="learning-slot-wrap">
            <LearningCard item={item} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal kind="lead" className="learning-legend" delay={0.05} aria-label="Status legend">
        <Stagger className="learning-legend-row" gap={0.05}>
          {Object.entries(statusIcons).map(([status, Icon]) => (
            <StaggerItem key={status} className="legend-item">
              <Icon size={12} aria-hidden="true" className={`legend-icon--${statusTone[status]}`} />
              {status}
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>
    </section>
  );
}