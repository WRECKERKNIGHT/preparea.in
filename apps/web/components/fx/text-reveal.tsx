"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Reveals text character by character or word by word.
 * Falls back to plain text if GSAP fails to load.
 */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
}: TextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Split text into characters for animation
    const words = text.split(" ");
    container.innerHTML = "";

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "inline-block mr-[0.25em]";

      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.className = "inline-block opacity-0";
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
        charsRef.current.push(charSpan);
      });

      container.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        container.appendChild(document.createTextNode(" "));
      }
    });

    if (reduce) {
      // Disable animation for reduced motion preference
      charsRef.current.forEach((char) => {
        char.classList.remove("opacity-0");
      });
      return;
    }

    const tl = gsap.timeline({
      delay,
      defaults: { ease: "power2.out" }
    });

    tl.to(charsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: stagger,
    });

    return () => {
      tl.kill();
    };
  }, [text, delay, stagger]);

  return (
    <span ref={containerRef} className={className}>
      {text}
    </span>
  );
}
