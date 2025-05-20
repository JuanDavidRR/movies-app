export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};

export type DocumentMovie = {
  $id: number;
  $title: string;
  $poster_path: string;
};

export type TrendingMovie = {
  $id: string;
  poster_url: string;
  title: string;
  searchTerm: string;
};
