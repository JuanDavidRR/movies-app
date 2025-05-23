// components/TrendingSection.tsx
import { useTrendingAnimation } from "../hooks/useTrendingAnimation";
import type { TrendingMovie } from "../types";

interface TrendingSectionProps {
  trendingMovies: TrendingMovie[];
}

const TrendingSection = ({ trendingMovies }: TrendingSectionProps) => {
  const { trendingSectionRef } = useTrendingAnimation(trendingMovies);

  if (trendingMovies.length === 0) return null;

  return (
    <section
      className="trending"
      aria-labelledby="trending-heading"
      ref={trendingSectionRef}
    >
      <h2 id="trending-heading">Based on your searches</h2>

      <div className="overflow-x-auto md:overflow-visible">
        <ul
          className="flex w-full gap-4 pb-4 md:grid md:grid-cols-5 md:gap-6"
          aria-label="Trending movies list"
        >
          {trendingMovies.map((movie, index) => (
            <li
              key={movie.$id}
              className="flex flex-col flex-shrink-0 w-[60vw] md:w-full trend-movie"
            >
              <div className="flex items-center w-full">
                <p
                  className="text-7xl md:text-9xl flex-shrink-0"
                  aria-hidden="true"
                >
                  {index + 1}
                </p>
                <div className="flex-1 overflow-hidden md:w-full">
                  <img
                    src={
                      movie.poster_url === "https://image.tmdb.org/t/p/w500null"
                        ? "no-movie.png"
                        : movie.poster_url
                    }
                    alt={`Movie poster for ${movie.movie_title}`}
                    loading="lazy"
                    className="max-w-full h-auto object-cover rounded-lg"
                    width="200"
                    height="300"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrendingSection;
