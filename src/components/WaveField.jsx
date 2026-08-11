import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const RIBBON_COLORS = [
  [30, 211, 255],
  [43, 116, 255],
  [112, 79, 255],
  [193, 62, 255],
  [20, 238, 210],
];

function drawRibbon(context, width, height, ribbon, time) {
  const verticalCenter = height * ribbon.center;
  const amplitude = height * ribbon.amplitude;
  const phase = ribbon.phase + time * ribbon.speed;
  const color = RIBBON_COLORS[ribbon.color];

  context.beginPath();
  for (let index = 0; index <= ribbon.segments; index += 1) {
    const progress = index / ribbon.segments;
    const x = width * (progress * 1.18 - 0.09);
    const convergence = Math.sin(progress * Math.PI);
    const sweep = Math.sin(progress * TAU * ribbon.frequency + phase);
    const secondary = Math.sin(progress * Math.PI * 3.2 - phase * 0.72);
    const y = verticalCenter
      + sweep * amplitude
      + secondary * amplitude * 0.26
      + convergence * height * ribbon.drift;

    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.strokeStyle = `rgba(${color.join(", ")}, ${ribbon.opacity})`;
  context.lineWidth = ribbon.width;
  context.shadowColor = `rgba(${color.join(", ")}, 0.72)`;
  context.shadowBlur = ribbon.blur;
  context.stroke();
}

function createRibbons() {
  return Array.from({ length: 18 }, (_, index) => ({
    center: 0.18 + (index % 9) * 0.072 + (index > 8 ? 0.035 : 0),
    amplitude: 0.035 + (index % 5) * 0.012,
    phase: index * 0.81,
    speed: 0.07 + (index % 4) * 0.012,
    frequency: 0.58 + (index % 6) * 0.075,
    drift: ((index % 7) - 3) * 0.008,
    opacity: 0.2 + (index % 4) * 0.035,
    width: index % 5 === 0 ? 1.45 : 0.8,
    blur: index % 5 === 0 ? 9 : 5,
    color: index % RIBBON_COLORS.length,
    segments: 72,
  }));
}

const ribbons = createRibbons();

export function WaveField({ reducedMotion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let startTime = performance.now();

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const render = (timestamp) => {
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "lighter";
      const elapsed = reducedMotion ? 12 : (timestamp - startTime) / 1000;
      ribbons.forEach((ribbon) => drawRibbon(context, width, height, ribbon, elapsed));
      context.restore();

      if (!reducedMotion) frameId = window.requestAnimationFrame(render);
    };

    const handleResize = () => {
      resize();
      if (reducedMotion) render(startTime);
    };

    resize();
    frameId = window.requestAnimationFrame(render);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="wave-field" aria-hidden="true" />;
}
