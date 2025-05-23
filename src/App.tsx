// App.tsx - With Top Rated Movies Added
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./components/Header";
import TrendingSection from "./components/TrendingSection";
import MoviesSection from "./components/MoviesSection";
import { useMovies } from "./hooks/useMovies";
import { useTrendingMovies } from "./hooks/useTrendingMovies";

// Register the plugins once at the app level
gsap.registerPlugin(SplitText, ScrollTrigger);

const App = () => {
  // Regular search/discover movies
  const { searchTerm, setSearchTerm, movieList, errorMessage, isLoading } =
    useMovies();

  // Top rated movies
  const {
    movieList: topRatedMovies,
    errorMessage: topRatedError,
    isLoading: topRatedLoading,
  } = useMovies(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"
  );

  const { trendingMovies } = useTrendingMovies();

  return (
    <main role="main">
      <a
        href="#all-movies"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:right-0 focus:mx-auto focus:w-max focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:font-bold focus:z-50 focus:rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Skip to movie content"
      >
        Skip to Movies
      </a>

      <div className="pattern" aria-hidden="true" />

      <div className="wrapper">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <TrendingSection trendingMovies={trendingMovies} />

        {/* Top Rated Movies Section */}
        <MoviesSection
          title="Top Rated Movies"
          movieList={topRatedMovies}
          isLoading={topRatedLoading}
          errorMessage={topRatedError}
          limit={10}
        />

        {/* Regular Movies Section */}
        <MoviesSection
          title="Latest Movies"
          movieList={movieList}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </main>
  );
};

export default App;
