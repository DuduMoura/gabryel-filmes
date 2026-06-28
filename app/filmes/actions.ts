"use server";

import { getExploreCatalogPage, type ExploreTabId } from "@/lib/explore";

/** Server Action: busca a próxima página de uma categoria para o botão "Carregar mais". */
export async function loadMoreFilms(tab: ExploreTabId, page: number) {
  return getExploreCatalogPage(tab, page);
}
