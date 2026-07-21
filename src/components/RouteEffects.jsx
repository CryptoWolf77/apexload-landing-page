import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef("");

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      previousPath.current = pathname;
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (previousPath.current && previousPath.current !== pathname) {
      window.requestAnimationFrame(() => document.querySelector("[data-route-focus]")?.focus());
    }
    previousPath.current = pathname;
  }, [hash, pathname]);

  return null;
}
