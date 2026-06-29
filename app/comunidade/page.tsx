import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";
import { getMovieDetails, getPosterUrl } from "@/lib/tmdb";
import { SiteNav } from "@/components/SiteNav";
import { ComunidadeFeed, type FeedItem } from "@/components/ComunidadeFeed";

export const metadata: Metadata = {
  title: "Comunidade · ReelRate",
};

export default async function ComunidadePage() {
  const session = await requireUserSession();
  if (!session) redirect("/login?callbackUrl=/comunidade");

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: true },
  });

  const moviesById = new Map<number, { title: string; posterUrl: string | null }>();
  await Promise.all(
    reviews.map(async (review) => {
      if (moviesById.has(review.tmdbMovieId)) return;
      try {
        const movie = await getMovieDetails(review.tmdbMovieId);
        moviesById.set(review.tmdbMovieId, { title: movie.title, posterUrl: getPosterUrl(movie.poster_path, "w342") });
      } catch (error) {
        console.error(`Falha ao buscar o filme ${review.tmdbMovieId} na TMDB:`, error);
      }
    }),
  );

  const feedItems: FeedItem[] = reviews.map((review) => {
    const movie = moviesById.get(review.tmdbMovieId);
    return {
      id: review.id,
      userName: review.user.name,
      userAvatarUrl: review.user.avatarUrl,
      rating: review.rating,
      comment: review.comment,
      createdAtIso: review.createdAt.toISOString(),
      movieId: review.tmdbMovieId,
      movieTitle: movie?.title ?? `Filme #${review.tmdbMovieId}`,
      moviePosterUrl: movie?.posterUrl ?? null,
      isOwn: review.userId === session.user.id,
    };
  });

  return (
    <div style={{ background: "#0a0a0e", minHeight: "100vh" }}>
      <SiteNav active="comunidade" />

      <header
        style={{
          paddingTop: 140,
          paddingBottom: 40,
          paddingLeft: 48,
          paddingRight: 48,
          background: "linear-gradient(180deg, rgba(192,57,43,0.12) 0%, rgba(10,10,14,0) 70%)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 40,
            letterSpacing: 1,
            color: "#eeeae4",
            margin: 0,
          }}
        >
          Comunidade
        </h1>
        <p
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 14,
            color: "rgba(238,234,228,0.55)",
            margin: "8px 0 0",
          }}
        >
          Acompanhe as críticas dos seus amigos e de outros usuários da plataforma.
        </p>
      </header>

      <main style={{ padding: "0 48px 80px", maxWidth: 720 }}>
        <ComunidadeFeed items={feedItems} />
      </main>
    </div>
  );
}
