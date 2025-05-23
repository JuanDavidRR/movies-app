// hooks/useTrendingAnimation.ts
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useTrendingAnimation = (trendingMovies: unknown[]) => {
  const trendingSectionRef = useRef(null);
  const trendingAnimationRef = useRef(null);

  const animateTrendingMovies = () => {
    if (!trendingSectionRef.current) return;

    // Get all trend-movie elements
    const trendMovies = document.querySelectorAll(".trend-movie");

    // If there are no trend-movie elements, return
    if (trendMovies.length === 0) return;

    // Clear any previous animation
    if (trendingAnimationRef.current) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

    // Set initial state for all trend-movie elements
    gsap.set(trendMovies, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    // Create the ScrollTrigger animation
     ScrollTrigger.create({
      trigger: trendingSectionRef.current,
      start: "top 70%",
      onEnter: () => {
        // Animate each element with a staggered delay
        gsap.to(trendMovies, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.35,
          onStart: function () {
            // Optional: Add a highlight effect for each element as it appears
            const currentElement = this.targets()[0];
            gsap.fromTo(
              currentElement,
              { boxShadow: "0 0 0 rgba(255,255,255,0)" },
              {
                boxShadow:
                  "0 0 20px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3)",
                duration: 0.4,
                yoyo: true,
                repeat: 1,
              }
            );
          },
        });
      },
      once: false,
    });
  };

  useEffect(() => {
    if (trendingMovies.length > 0) {
      // Wait for next render cycle to ensure elements are in DOM
      setTimeout(() => {
        animateTrendingMovies();
      }, 100);
    }

    // Clean up ScrollTrigger when unmounting
    return () => {
      if (trendingAnimationRef.current) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, [trendingMovies]);

  return { trendingSectionRef };
};
