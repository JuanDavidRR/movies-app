import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Movie } from "../types";

// Registrar el plugin (necesario en cada archivo que use ScrollTrigger)
gsap.registerPlugin(ScrollTrigger);

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date },
}: MovieCardProps) => {
  // Referencia al elemento de la tarjeta
  const cardRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef({ skew: 0 });
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Configurar el efecto de skew cuando el componente se monta
  useEffect(() => {
    // Solo configurar el efecto si la referencia existe
    if (cardRef.current) {
      // Establecer transformOrigin
      gsap.set(cardRef.current, {
        transformOrigin: "right center",
        force3D: true,
      });

      const proxy = proxyRef.current;
      // Crear un setter específico para este elemento
      const skewSetter = gsap.quickSetter(cardRef.current, "skewY", "deg");
      const clamp = gsap.utils.clamp(-20, 20); // limita el skew a +/- 20 grados

      // Crear ScrollTrigger para esta tarjeta específica
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: cardRef.current, // Solo se activa cuando esta tarjeta está en la vista
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -300);

          // Solo actualizar si el skew es más severo
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });
    }

    // Limpiar al desmontar el componente
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <li>
      <div className="movie-card skewElem" ref={cardRef}>
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
        />
        <div className="mt-4">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="Star icon" />
              <p>{vote_average ? vote_average.toFixed(1) : "No rating"}</p>
            </div>
            <span>•</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "No data"}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MovieCard;
