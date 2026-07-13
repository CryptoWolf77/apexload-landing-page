import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "../lib/motion.js";

const motionTags = {
  div: motion.div,
  section: motion.section,
  footer: motion.footer,
  header: motion.header,
  main: motion.main,
};

function getMotionTag(as) {
  return motionTags[as] || motion.section;
}

function reducedVariant(variant) {
  if (!variant) return undefined;

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };
}

export function AnimatedSection({
  as = "section",
  children,
  className,
  variants = fadeUp,
  viewport = { once: true, amount: 0.18 },
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const [safeVisible, setSafeVisible] = useState(false);
  const MotionTag = getMotionTag(as);

  useEffect(() => {
    const timer = window.setTimeout(() => setSafeVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <MotionTag
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={safeVisible || prefersReducedMotion ? "visible" : undefined}
      whileInView="visible"
      viewport={viewport}
      variants={prefersReducedMotion ? reducedVariant(variants) : variants}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
