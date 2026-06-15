import "server-only";

/**
 * Cliente da API TMDB (server-only).
 * A chave (TMDB_API_KEY) NUNCA vai para o cliente — todas as chamadas saem do servidor.
 * O catálogo não é persistido: a aplicação referencia os filmes pelo ID da TMDB.
 */

const BASE_URL = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";

// Tipos mínimos (tipagem completa fica para as issues de feature).
export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbMovieDetails extends TmdbMovie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
}

export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

type QueryParams = Record<string, string | number | undefined>;

async function tmdb<T>(
  path: string,
  params: QueryParams = {},
  revalidate = 3600,
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TMDB_API_KEY não configurada. Defina-a em .env.local (chave v3 da TMDB).",
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "pt-BR");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`TMDB ${res.status} em ${path}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Lançamentos em cartaz. Cache curto (lista muda com frequência). */
export function getNowPlaying(page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>("/movie/now_playing", { page }, 600);
}

/** Busca de filmes por texto. Sem cache (resultado depende da query). */
export function searchMovies(query: string, page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>("/search/movie", { query, page }, 0);
}

/** Detalhes de um filme. Cache longo (dados estáveis). */
export function getMovieDetails(id: number) {
  return tmdb<TmdbMovieDetails>(`/movie/${id}`, {}, 86400);
}
