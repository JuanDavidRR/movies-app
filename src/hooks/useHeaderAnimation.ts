// hooks/useHeaderAnimation.ts
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

export const useHeaderAnimation = () => {
  const textRef = useRef<HTMLElement | null>(null);
  const splitRef = useRef<SplitText | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const playAnimation = () => {
    if (!textRef.current) return;

    // Revert previous animation if it exists
    if (animationRef.current) {
      animationRef.current.revert();
    }

    // Revert previous split if it exists
    if (splitRef.current) {
      splitRef.current.revert();
    }

    // Create new SplitText
    splitRef.current = new SplitText(textRef.current, {
      type: "chars,words,lines",
      charsClass: "char",
      wordsClass: "word",
      linesClass: "line",
    });

    // Create new animation
    animationRef.current = gsap.from(splitRef.current.words, {
      y: -100,
      opacity: 0,
      rotation: "random(-80, 80)",
      duration: 1.2,
      ease: "back",
      stagger: 0.25,
    });
  };

  useEffect(() => {
    // Wait for fonts to load before applying SplitText
    document.fonts.ready.then(() => {
      playAnimation();

      // Set up resize listener
      const handleResize = () => {
        playAnimation();
      };

      window.addEventListener("resize", handleResize);

      // Clean up listener when unmounting
      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          animationRef.current.revert();
        }
        if (splitRef.current) {
          splitRef.current.revert();
        }
      };
    });
  }, []);

  return { textRef };
};
