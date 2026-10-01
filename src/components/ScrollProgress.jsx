import { motion } from 'framer-motion';
import { useReduced, useScrollProgress } from '../utils/motion-primitives';
import '../styles/components/ambient.css';

export default function ScrollProgress() {
  const scaleX = useScrollProgress();
  const reduced = useReduced();

  if (reduced) return null;

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX }}
    />
  );
}