// hooks/useGSAPCarousel.ts
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseGSAPCarouselOptions {
  spacing?: number;
}

export const useGSAPCarousel = (
  shouldAnimate: boolean,
  dependencies: unknown[],
  options: UseGSAPCarouselOptions = {}
) => {
  const { spacing = 0.11 } = options;
  const galleryRef = useRef<HTMLDivElement>(null);
  const animationRefs = useRef<{
    iteration: number;
    seamlessLoop: gsap.core.Timeline | null;
    scrub: gsap.core.Tween | null;
    trigger: ScrollTrigger | null;
  }>({
    iteration: 0,
    seamlessLoop: null,
    scrub: null,
    trigger: null,
  });

  function buildSeamlessLoop(items: Element[], spacing: number) {
    const overlap = Math.ceil(1 / spacing);
    const startTime = items.length * spacing + 0.5;
    const loopTime = (items.length + overlap) * spacing + 1;
    const rawSequence = gsap.timeline({ paused: true });
    const seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        if (this._time === this._dur) {
          this._tTime += this._dur - 0.01;
        }
      },
    });

    const l = items.length + overlap * 2;
    let time = 0;

    // Set initial state
    gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

    // Create animations
    for (let i = 0; i < l; i++) {
      const index = i % items.length;
      const item = items[index];
      time = i * spacing;

      rawSequence
        .fromTo(
          item,
          { scale: 0.8, opacity: 0.1 },
          {
            scale: 1,
            opacity: 1,
            zIndex: 100,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power1.in",
            immediateRender: false,
          },
          time
        )
        .fromTo(
          item,
          { xPercent: 400 },
          {
            xPercent: -400,
            duration: 1,
            ease: "none",
            immediateRender: false,
          },
          time
        );

      if (i <= items.length) {
        seamlessLoop.add("label" + i, time);
      }
    }

    rawSequence.time(startTime);
    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none",
      })
      .fromTo(
        rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: "none",
        }
      );

    return seamlessLoop;
  }

  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    const initializeGSAPAnimation = () => {
      if (!galleryRef.current) return;

      const cards = gsap.utils.toArray(".cards .card-item");
      if (cards.length === 0) return;

      const { iteration } = animationRefs.current;
      // Build seamless loop
      const seamlessLoop = buildSeamlessLoop(cards as Element[], spacing);

      // Create scrub tween
      const scrub = gsap.to(seamlessLoop, {
        totalTime: 0,
        duration: 0.5,
        ease: "power3",
        paused: true,
      });

      const handleHorizontalScroll = (event: WheelEvent) => {
        // Only respond to horizontal scroll (shift + wheel or trackpad horizontal)
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          event.preventDefault();

          const scrollDelta = (event.deltaX > 0 ? spacing : -spacing) * 0.1; // Much softer
          const newTime = Math.max(0, scrub.vars.totalTime + scrollDelta);

          scrub.vars.totalTime = newTime;
          scrub.invalidate().restart();
        }
      };

      // Add horizontal scroll listener to the gallery
      if (galleryRef.current) {
        galleryRef.current.addEventListener("wheel", handleHorizontalScroll, {
          passive: false,
        });
      }

      // Store references
      animationRefs.current = {
        iteration,
        seamlessLoop,
        scrub,
        trigger: null, // No ScrollTrigger needed anymore
      };

      // Helper function to navigate manually (buttons only)
      function scrubTo(totalTime: number) {
        scrub.vars.totalTime = totalTime;
        scrub.invalidate().restart();
      }

      // Add navigation event listeners
      const handleNext = () => scrubTo(scrub.vars.totalTime + spacing);
      const handlePrev = () => scrubTo(scrub.vars.totalTime - spacing);

      const nextBtn = galleryRef.current?.querySelector(".next");
      const prevBtn = galleryRef.current?.querySelector(".prev");

      if (nextBtn) {
        nextBtn.addEventListener("click", handleNext);
      }
      if (prevBtn) {
        prevBtn.addEventListener("click", handlePrev);
      }

      // Cleanup function
      return () => {
        if (galleryRef.current) {
          galleryRef.current.removeEventListener(
            "wheel",
            handleHorizontalScroll
          );
        }
        if (nextBtn) {
          nextBtn.removeEventListener("click", handleNext);
        }
        if (prevBtn) {
          prevBtn.removeEventListener("click", handlePrev);
        }
      };
    };

    const timeoutId = setTimeout(initializeGSAPAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationRefs.current.scrub) {
        animationRefs.current.scrub.kill();
      }
      if (animationRefs.current.seamlessLoop) {
        animationRefs.current.seamlessLoop.kill();
      }
    };
  }, [shouldAnimate, spacing, ...dependencies]);

  return galleryRef;
};
