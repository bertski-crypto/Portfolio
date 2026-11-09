import { motion } from 'framer-motion';
import { useScroll, useSpring } from 'framer-motion';
import { useReduced } from '../utils/motion-primitives';
import { useScrollContainer } from '../context/ScrollContext';
import '../styles/components/ambient.css';

export default function ScrollProgress() {
  const reduced = useReduced();
  const containerRef = useScrollContainer();

  const { scrollYProgress } = useScroll({ container: containerRef ?? undefined });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX }}
    />
  );
}
