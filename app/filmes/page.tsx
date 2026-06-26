import type { Metadata } from "next";
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
} from "@/lib/tmdb";
import { ExploreFilms, type ExploreFilm, type ExploreTabId } from "@/components/ExploreFilms";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Explorar filmes · ReelRate",
  description: "Descubra filmes por categoria, gênero e nota — e encontre o próximo que vai entrar no seu diário.",
};

function buildGenreMap(genres: TmdbGenre[]): Map<number, string> {
  return new Map(genres.map((genre) => [genre.id, genre.name]));
}

function mergeIntoCatalog(
  catalog: Map<number, ExploreFilm>,
  movies: TmdbMovie[],
  tag: ExploreTabId,
  genreMap: Map<number, string>,
) {
  for (const movie of movies) {
    const existing = catalog.get(movie.id);
    if (existing) {
      if (!existing.tags.includes(tag)) existing.tags.push(tag);
      continue;
    }
    catalog.set(movie.id, {
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? String(new Date(movie.release_date).getFullYear()) : "—",
      posterUrl: getPosterUrl(movie.poster_path),
      rating: movie.vote_average,
      reviews: movie.vote_count,
      genre: genreMap.get(movie.genre_ids[0] ?? -1) ?? "Outro",
      tags: [tag],
    });
  }
}

async function getExploreFilms(): Promise<ExploreFilm[]> {
  const [genres, topRated, upcoming, trending, nowPlaying, acclaimed] = await Promise.all([
    getGenres(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getTrendingMoviesWeek(),
    getNowPlaying(),
    getAcclaimedMovies(),
  ]);

  const genreMap = buildGenreMap(genres);
  const catalog = new Map<number, ExploreFilm>();

  mergeIntoCatalog(catalog, topRated.results, "top", genreMap);
  mergeIntoCatalog(catalog, upcoming.results, "new", genreMap);
  mergeIntoCatalog(catalog, trending.results, "week", genreMap);
  mergeIntoCatalog(catalog, nowPlaying.results, "nowplay", genreMap);
  mergeIntoCatalog(catalog, acclaimed.results, "acclaimed", genreMap);

  return Array.from(catalog.values());
}

export default async function FilmesPage() {
  let films: ExploreFilm[] = [];
  let hasError = false;

  try {
    films = await getExploreFilms();
  } catch (error) {
    console.error("Falha ao buscar filmes na TMDB:", error);
    hasError = true;
  }

  return (
    <>
      <SiteNav active="filmes" />
      {hasError ? (
        <main
          style={{
            background: "#0a0a0e",
            color: "#eeeae4",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 48px",
          }}
        >
          <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 14, color: "rgba(238,234,228,0.5)" }}>
            Não foi possível carregar os filmes agora. Tente novamente em breve.
          </p>
        </main>
      ) : (
        <ExploreFilms films={films} />
      )}
    </>
  );
}
