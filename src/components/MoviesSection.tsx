// components/MoviesSection.tsx - With Animation Logic in Hook
import { lazy, Suspense } from "react";
import Spinner from "./Spinner";
import type { Movie } from "../types";
import { useGSAPCarousel } from "../hooks/useCarouselAnimation";

const MovieCard = lazy(() => import("./MovieCard"));

interface MoviesSectionProps {
  movieList: Movie[];
  isLoading: boolean;
  errorMessage: string;
  title?: string;
  limit?: number;
}

const MoviesSection = ({
  movieList,
  isLoading,
  errorMessage,
  title = "Latest Movies",
  limit,
}: MoviesSectionProps) => {
  // Get the movies to display
  const displayMovies = limit ? movieList.slice(0, limit) : movieList;

  // Use the GSAP carousel hook
  const galleryRef = useGSAPCarousel(
    !!(limit && displayMovies.length && !isLoading && !errorMessage),
    [displayMovies, limit, isLoading, errorMessage],
    { spacing: 0.11 }
  );

  return (
    <section
      className="all-movies mt-20 relative"
      id="all-movies"
      aria-labelledby="movies-heading"
    >
      <h2 id="movies-heading">{title}</h2>
      <Suspense fallback={<Spinner />}>
        {isLoading ? (
          <Spinner aria-label={`Loading ${title.toLowerCase()}`} />
        ) : errorMessage ? (
          <p className="bg-red-700 text-white p-2" role="alert">
            {errorMessage}
          </p>
        ) : (
          movieList.length > 0 &&
          (!limit ? (
            <ul aria-label={`${title} list`}>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          ) : (
            <div className="carousel-container">
              <div className="gallery" ref={galleryRef}>
                <div className="cards">
                  {displayMovies.map((movie) => (
                    <div key={movie.id} className="card-item">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-between gap-10 text-white">
                  <button
                    className="cursor-pointer prev w-32 bg-[#110f2a] hover:bg-[#2a283f] transition-colors py-2 px-3 grid place-content-center rounded-lg"
                    aria-label="Previous movie"
                  >
                    Previous
                  </button>
                  <button
                    className="cursor-pointer next w-32 bg-[#110f2a] hover:bg-[#2a283f] transition-colors py-2 px-3 place-content-center rounded-lg"
                    aria-label="Next movie"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </Suspense>
    </section>
  );
};

export default MoviesSection;
