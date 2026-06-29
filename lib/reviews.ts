import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Nota da própria plataforma (agregada a partir das avaliações dos usuários).
 * A escala é de 1 a 5, igual ao que o usuário atribui ao avaliar.
 */
export type PlatformRating = { average: number; count: number };

/**
 * Nota média e quantidade de avaliações da plataforma para um conjunto de filmes
 * (referenciados pelo ID da TMDB). Filmes sem nenhuma avaliação simplesmente não
 * aparecem no mapa — o chamador trata como "sem nota".
 */
export async function getPlatformRatings(
  tmdbMovieIds: number[],
): Promise<Map<number, PlatformRating>> {
  const map = new Map<number, PlatformRating>();
  if (tmdbMovieIds.length === 0) return map;

  try {
    const grouped = await prisma.review.groupBy({
      by: ["tmdbMovieId"],
      where: { tmdbMovieId: { in: tmdbMovieIds } },
      _avg: { rating: true },
      _count: { rating: true },
    });

    for (const row of grouped) {
      map.set(row.tmdbMovieId, {
        average: row._avg.rating ?? 0,
        count: row._count.rating,
      });
    }
  } catch (error) {
    console.error("Falha ao agregar notas da plataforma:", error);
  }

  return map;
}
