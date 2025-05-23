// hooks/useMovies.ts - Simple version with just your endpoint added
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../appwrite";
import type { Movie } from "../types";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_IMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const useMovies = (endpoint?: string) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Only debounce when no custom endpoint is provided (for search functionality)
  useDebounce(
    () => {
      if (!endpoint) setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm, endpoint]
  );

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let finalEndpoint;

      if (endpoint) {
        // Use custom endpoint (like your top_rated)
        finalEndpoint = endpoint;
      } else {
        // Original search/discover logic
        finalEndpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
              query
            )}&sort_by=popularity.desc`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      }

      const response = await fetch(finalEndpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      if (data.total_results === 0) {
        setErrorMessage("No movies found. Try a different search term.");
        setMovieList([]);
        return;
      }

      const moviesWithType: Movie[] = data.results || [];
      setMovieList(moviesWithType);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0] as Movie);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      // Custom endpoint - fetch immediately
      fetchMovies();
    } else {
      // Search functionality
      fetchMovies(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, endpoint]);

  return {
    searchTerm,
    setSearchTerm,
    movieList,
    errorMessage,
    isLoading,
  };
};
