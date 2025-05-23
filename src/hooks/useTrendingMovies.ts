// hooks/useTrendingMovies.ts
import { useState, useEffect } from "react";
import { getTrendingMovies } from "../appwrite";
import type { TrendingMovie } from "../types";

export const useTrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      if (movies) {
        setTrendingMovies(movies);
      }
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return { trendingMovies };
};
