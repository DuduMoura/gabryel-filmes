"use server";

import { getExploreCatalogPage, searchExploreFilms, type ExploreTabId } from "@/lib/explore";

/** Server Action: busca a próxima página de uma categoria para o botão "Carregar mais". */
export async function loadMoreFilms(tab: ExploreTabId, page: number) {
  return getExploreCatalogPage(tab, page);
}

/** Server Action: busca filmes na TMDB pelo título (busca real, não só os já carregados). */
export async function searchFilms(query: string, page: number) {
  return searchExploreFilms(query, page);
}
