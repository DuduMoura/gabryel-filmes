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
  vote_count: number;
  genre_ids: number[];
  original_language: string;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails extends TmdbMovie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
  production_countries: { iso_3166_1: string; name: string }[];
}

export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
}

export interface TmdbCredits {
  crew: TmdbCrewMember[];
}

export interface TmdbMovieWithCredits extends TmdbMovieDetails {
  credits: TmdbCredits;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: { rating: number | null };
}

export interface TmdbImage {
  file_path: string;
}

export interface TmdbReleaseDatesResult {
  iso_3166_1: string;
  release_dates: { certification: string; release_date: string }[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbMovieFull extends TmdbMovieDetails {
  credits: { cast: TmdbCastMember[]; crew: TmdbCrewMember[] };
  images: { backdrops: TmdbImage[] };
  reviews: TmdbPaginated<TmdbReview>;
  release_dates: { results: TmdbReleaseDatesResult[] };
  videos: { results: TmdbVideo[] };
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

/** Filmes populares, paginados. Usado na página de exploração. Cache de 1h. */
export function getPopularMovies(page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>("/movie/popular", { page }, 3600);
}

/** Filmes com mais avaliações (vote_count) na TMDB, paginados. Cache de 1h. */
export function getMostReviewedMovies(page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>(
    "/discover/movie",
    { sort_by: "vote_count.desc", include_adult: "false", page },
    3600,
  );
}

/** Próximos lançamentos. Cache de 1h. */
export function getUpcomingMovies(page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>("/movie/upcoming", { page }, 3600);
}

/** Filmes em alta na semana. Cache curto (lista muda com frequência). */
export function getTrendingMoviesWeek(page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>("/trending/movie/week", { page }, 1800);
}

/** Filmes aclamados: nota alta com grande volume de votos. Cache de 1h. */
export function getAcclaimedMovies(page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>(
    "/discover/movie",
    { sort_by: "vote_average.desc", "vote_count.gte": 2000, include_adult: "false", page },
    3600,
  );
}

/** Lista de gêneros da TMDB (id → nome). Cache longo (lista quase nunca muda). */
export async function getGenres(): Promise<TmdbGenre[]> {
  const { genres } = await tmdb<{ genres: TmdbGenre[] }>("/genre/movie/list", {}, 86400);
  return genres;
}

/** Busca de filmes por texto. Sem cache (resultado depende da query). */
export function searchMovies(query: string, page = 1) {
  return tmdb<TmdbPaginated<TmdbMovie>>("/search/movie", { query, page }, 0);
}

/** Detalhes de um filme. Cache longo (dados estáveis). */
export function getMovieDetails(id: number) {
  return tmdb<TmdbMovieDetails>(`/movie/${id}`, {}, 86400);
}

/** Detalhes de um filme incluindo a equipe técnica (para extrair o diretor). Cache longo. */
function getMovieDetailsWithCredits(id: number) {
  return tmdb<TmdbMovieWithCredits>(
    `/movie/${id}`,
    { append_to_response: "credits" },
    86400,
  );
}

/** Filmes com mais votos na TMDB, com detalhes e equipe técnica. Cache de 1h. */
export async function getTopVotedMovies(limit = 6): Promise<TmdbMovieWithCredits[]> {
  const { results } = await tmdb<TmdbPaginated<TmdbMovie>>(
    "/discover/movie",
    { sort_by: "vote_count.desc", include_adult: "false" },
    3600,
  );
  const topIds = results.slice(0, limit).map((movie) => movie.id);
  return Promise.all(topIds.map((id) => getMovieDetailsWithCredits(id)));
}

/** Nome do diretor de um filme, se a TMDB tiver essa informação. */
export function getMovieDirector(movie: TmdbMovieWithCredits): string | null {
  return movie.credits.crew.find((member) => member.job === "Director")?.name ?? null;
}

/** URL completa do pôster, ou null se a TMDB não tiver a imagem. */
export function getPosterUrl(path: string | null, size: "w342" | "w500" = "w500"): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

/** URL completa do backdrop, ou null se a TMDB não tiver a imagem. */
export function getBackdropUrl(path: string | null, size: "w1280" | "original" = "w1280"): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

/** URL completa da foto de um membro do elenco/equipe, ou null se a TMDB não tiver a imagem. */
export function getProfileUrl(path: string | null, size: "w185" = "w185"): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

/**
 * Página individual de um filme: detalhes + elenco/equipe + imagens + similares +
 * críticas + classificação por país, tudo em uma única chamada (append_to_response).
 * Cache de 1h.
 */
export function getMovieFull(id: number) {
  return tmdb<TmdbMovieFull>(
    `/movie/${id}`,
    {
      append_to_response: "credits,images,reviews,release_dates,videos",
      include_image_language: "pt,en,null",
    },
    3600,
  );
}

/**
 * Filmes de fato semelhantes: mesmo gênero principal e mesmo idioma original do filme,
 * ordenados pelos mais votados. A TMDB não tem um filtro pronto pra isso (o endpoint
 * /similar mistura gêneros e idiomas), então usamos o discover com os dois critérios.
 * Cache de 1h.
 */
export async function getSimilarMovies(movie: TmdbMovieFull, limit = 8): Promise<TmdbMovie[]> {
  const primaryGenreId = movie.genres[0]?.id;
  if (!primaryGenreId) return [];

  const { results } = await tmdb<TmdbPaginated<TmdbMovie>>(
    "/discover/movie",
    {
      with_genres: primaryGenreId,
      with_original_language: movie.original_language,
      sort_by: "vote_count.desc",
      "vote_count.gte": 20,
      include_adult: "false",
    },
    3600,
  );

  return results.filter((result) => result.id !== movie.id).slice(0, limit);
}

/** Trailer oficial (YouTube) de um filme, se a TMDB tiver essa informação. */
export function getTrailerKey(movie: TmdbMovieFull): string | null {
  const videos = movie.videos.results.filter((video) => video.site === "YouTube" && video.type === "Trailer");
  const official = videos.find((video) => video.official) ?? videos[0];
  return official?.key ?? null;
}

/** Nomes dos diretores de um filme (pode haver mais de um). */
export function getDirectors(movie: TmdbMovieFull): string[] {
  return movie.credits.crew.filter((member) => member.job === "Director").map((member) => member.name);
}

/** Nomes dos roteiristas de um filme (Screenplay/Writer/Story), sem duplicatas. */
export function getWriters(movie: TmdbMovieFull): string[] {
  const writerJobs = new Set(["Screenplay", "Writer", "Story"]);
  const names = movie.credits.crew.filter((member) => writerJobs.has(member.job)).map((member) => member.name);
  return Array.from(new Set(names));
}

/** Classificação indicativa brasileira do filme, se a TMDB tiver essa informação. */
export function getBrCertification(movie: TmdbMovieFull): string | null {
  const br = movie.release_dates.results.find((result) => result.iso_3166_1 === "BR");
  const certification = br?.release_dates.find((entry) => entry.certification)?.certification;
  return certification || null;
}
