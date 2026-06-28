import "server-only";
import {
  getAcclaimedMovies,
  getGenres,
  getNowPlaying,
  getPosterUrl,
  getTopRatedMovies,
  getTrendingMoviesWeek,
  getUpcomingMovies,
  type TmdbGenre,
  type TmdbMovie,
  type TmdbPaginated,
} from "@/lib/tmdb";

export type ExploreTabId = "top" | "new" | "week" | "nowplay" | "acclaimed";

export type ExploreFilm = {
  id: number;
  title: string;
  year: string;
  posterUrl: string | null;
  rating: number;
  reviews: number;
  genre: string;
  tags: ExploreTabId[];
};

export type ExplorePageInfo = Record<ExploreTabId, { page: number; totalPages: number; totalResults: number }>;

const TAB_FETCHERS: Record<ExploreTabId, (page: number) => Promise<TmdbPaginated<TmdbMovie>>> = {
  top: getTopRatedMovies,
  new: getUpcomingMovies,
  week: getTrendingMoviesWeek,
  nowplay: getNowPlaying,
  acclaimed: getAcclaimedMovies,
};

const TAB_IDS: ExploreTabId[] = ["top", "new", "week", "nowplay", "acclaimed"];

function buildGenreMap(genres: TmdbGenre[]): Map<number, string> {
  return new Map(genres.map((genre) => [genre.id, genre.name]));
}

function movieToExploreFilm(movie: TmdbMovie, tag: ExploreTabId, genreMap: Map<number, string>): ExploreFilm {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? String(new Date(movie.release_date).getFullYear()) : "—",
    posterUrl: getPosterUrl(movie.poster_path),
    rating: movie.vote_average,
    reviews: movie.vote_count,
    genre: genreMap.get(movie.genre_ids[0] ?? -1) ?? "Outro",
    tags: [tag],
  };
}

/** Primeira página de cada categoria, mesclada num catálogo único. Usado no carregamento inicial de /filmes. */
export async function getExploreCatalog(): Promise<{ films: ExploreFilm[]; pageInfo: ExplorePageInfo }> {
  const [genres, ...pages] = await Promise.all([getGenres(), ...TAB_IDS.map((tab) => TAB_FETCHERS[tab](1))]);
  const genreMap = buildGenreMap(genres);

  const catalog = new Map<number, ExploreFilm>();
  const pageInfo = {} as ExplorePageInfo;

  TAB_IDS.forEach((tab, index) => {
    const result = pages[index];
    pageInfo[tab] = { page: 1, totalPages: result.total_pages, totalResults: result.total_results };
    for (const movie of result.results) {
      const existing = catalog.get(movie.id);
      if (existing) {
        if (!existing.tags.includes(tab)) existing.tags.push(tab);
        continue;
      }
      catalog.set(movie.id, movieToExploreFilm(movie, tab, genreMap));
    }
  });

  return { films: Array.from(catalog.values()), pageInfo };
}

/** Uma página adicional de uma categoria específica. Usado pelo botão "Carregar mais". */
export async function getExploreCatalogPage(
  tab: ExploreTabId,
  page: number,
): Promise<{ films: ExploreFilm[]; totalPages: number; totalResults: number }> {
  const [genres, result] = await Promise.all([getGenres(), TAB_FETCHERS[tab](page)]);
  const genreMap = buildGenreMap(genres);
  return {
    films: result.results.map((movie) => movieToExploreFilm(movie, tab, genreMap)),
    totalPages: result.total_pages,
    totalResults: result.total_results,
  };
}
