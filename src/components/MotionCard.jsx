import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  style,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [supportsTilt, setSupportsTilt] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 220, damping: 24, mass: 0.55 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 220, damping: 24, mass: 0.55 });
  const MotionTag = getMotionTag(as);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateSupport = () => setSupportsTilt(pointerQuery.matches && !prefersReducedMotion);
    updateSupport();
    pointerQuery.addEventListener?.("change", updateSupport);
    return () => pointerQuery.removeEventListener?.("change", updateSupport);
  }, [prefersReducedMotion]);

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    cardRef.current?.style.setProperty("--card-glare-opacity", "0");
  };

  const handlePointerMove = (event) => {
    onPointerMove?.(event);
    if (!supportsTilt || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const maxRotateX = Math.max(1.8, Math.abs(Number(hover?.rotateX) || 0));
    const maxRotateY = Math.max(2.4, Math.abs(Number(hover?.rotateY) || 0));

    rotateX.set((0.5 - y) * maxRotateX * 2);
    rotateY.set((x - 0.5) * maxRotateY * 2);
    event.currentTarget.style.setProperty("--card-glare-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--card-glare-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--card-glare-opacity", "1");
  };

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
  };

  const handlePointerLeave = (event) => {
    onPointerLeave?.(event);
    resetTilt();
  };

  const hoverMotion = hover
    ? Object.fromEntries(Object.entries(hover).filter(([key]) => key !== "rotateX" && key !== "rotateY"))
    : undefined;

  return (
    <MotionTag
      ref={cardRef}
      className={["motion-card-tilt", className].filter(Boolean).join(" ")}
      variants={variants}
      whileHover={prefersReducedMotion ? undefined : hoverMotion}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        ...style,
        rotateX: supportsTilt ? smoothRotateX : 0,
        rotateY: supportsTilt ? smoothRotateY : 0,
        transformPerspective: 900,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
