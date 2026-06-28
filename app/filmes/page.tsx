import type { Metadata } from "next";
import { getExploreCatalog, type ExploreFilm, type ExplorePageInfo } from "@/lib/explore";
import { ExploreFilms } from "@/components/ExploreFilms";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Explorar filmes · ReelRate",
  description: "Descubra filmes por categoria, gênero e nota — e encontre o próximo que vai entrar no seu diário.",
};

export default async function FilmesPage() {
  let films: ExploreFilm[] = [];
  let pageInfo: ExplorePageInfo | null = null;
  let hasError = false;

  try {
    const catalog = await getExploreCatalog();
    films = catalog.films;
    pageInfo = catalog.pageInfo;
  } catch (error) {
    console.error("Falha ao buscar filmes na TMDB:", error);
    hasError = true;
  }

  return (
    <>
      <SiteNav active="filmes" />
      {hasError || !pageInfo ? (
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
        <ExploreFilms films={films} pageInfo={pageInfo} />
      )}
    </>
  );
}
