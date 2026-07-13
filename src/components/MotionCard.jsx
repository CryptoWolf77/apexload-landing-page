import { motion, useReducedMotion } from "framer-motion";
import { cardItem } from "../lib/motion.js";

const motionTags = {
  article: motion.article,
  div: motion.div,
  li: motion.li,
};

function getMotionTag(as) {
  return motionTags[as] || motion.article;
}

export function MotionCard({
  as = "article",
  children,
  className,
  variants = cardItem,
  hover = { y: -7, rotateX: 1.4, rotateY: -1.2 },
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = getMotionTag(as);

  return (
    <MotionTag
      className={className}
      variants={variants}
      whileHover={prefersReducedMotion ? undefined : hover}
      transition={{ duration: 0.22, ease: "easeOut" }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
