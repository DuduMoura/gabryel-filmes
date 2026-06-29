import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";
import { getMovieDetails, getPosterUrl } from "@/lib/tmdb";
import { SiteNav } from "@/components/SiteNav";
import { RatingStars } from "@/components/RatingStars";
import styles from "./perfil.module.css";

export const metadata: Metadata = {
  title: "Meu perfil · ReelRate",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function PerfilPage() {
  const session = await requireUserSession();
  if (!session) redirect("/login?callbackUrl=/perfil");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
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

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const initial = user.name.charAt(0).toUpperCase() || "?";

  return (
    <div style={{ background: "#0a0a0e", minHeight: "100vh" }}>
      <SiteNav />

      <header
        style={{
          paddingTop: 140,
          paddingBottom: 56,
          paddingLeft: 48,
          paddingRight: 48,
          background: "linear-gradient(180deg, rgba(192,57,43,0.12) 0%, rgba(10,10,14,0) 70%)",
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: "#251515",
            border: "3px solid #0a0a0e",
            boxShadow: "0 0 0 2px #c0392b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto enviada pelo usuário (data URL ou host externo arbitrário)
            <img
              src={user.avatarUrl}
              alt={user.name}
              width={104}
              height={104}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 44, color: "#eeeae4" }}>
              {initial}
            </span>
          )}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <h1
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: 40,
                letterSpacing: 1,
                color: "#eeeae4",
                margin: 0,
              }}
            >
              {user.name}
            </h1>
            <Link
              href="/perfil/editar"
              className={styles.editLink}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 13,
                color: "rgba(238,234,228,0.55)",
                textDecoration: "none",
                border: "1px solid rgba(238,234,228,0.2)",
                borderRadius: 4,
                padding: "4px 12px",
              }}
            >
              Editar perfil
            </Link>
          </div>
          <p
            style={{
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 14,
              color: "rgba(238,234,228,0.55)",
              margin: "4px 0 16px",
            }}
          >
            {user.email} · membro desde {formatDate(user.createdAt)}
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            <div>
              <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 24, color: "#eeeae4", margin: 0 }}>
                {reviews.length}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-lato), sans-serif",
                  fontSize: 12,
                  color: "rgba(238,234,228,0.55)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Críticas
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 24, color: "#eeeae4", margin: 0 }}>
                {averageRating ? averageRating.toFixed(1) : "—"}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-lato), sans-serif",
                  fontSize: 12,
                  color: "rgba(238,234,228,0.55)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Nota média
              </p>
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: "0 48px 80px", maxWidth: 960 }}>
        <h2
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 22,
            letterSpacing: 0.5,
            color: "#eeeae4",
            borderBottom: "1px solid rgba(238,234,228,0.1)",
            paddingBottom: 12,
            marginBottom: 20,
          }}
        >
          Críticas recentes
        </h2>

        {reviews.length === 0 ? (
          <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 14, color: "rgba(238,234,228,0.55)" }}>
            Você ainda não avaliou nenhum filme.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {reviews.map((review) => {
              const movie = moviesById.get(review.tmdbMovieId);
              return (
                <Link
                  key={review.id}
                  href={`/filmes/${review.tmdbMovieId}`}
                  className={styles.reviewCard}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid rgba(238,234,228,0.08)",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 78,
                      borderRadius: 4,
                      overflow: "hidden",
                      background: "#1a1a22",
                      flexShrink: 0,
                    }}
                  >
                    {movie?.posterUrl ? (
                      <Image src={movie.posterUrl} alt={movie.title} width={52} height={78} style={{ objectFit: "cover" }} />
                    ) : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-lato), sans-serif",
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#eeeae4",
                          margin: 0,
                        }}
                      >
                        {movie?.title ?? `Filme #${review.tmdbMovieId}`}
                      </h3>
                      <RatingStars rating={String(review.rating)} />
                    </div>
                    {review.comment ? (
                      <p
                        style={{
                          fontFamily: "var(--font-lato), sans-serif",
                          fontSize: 13,
                          color: "rgba(238,234,228,0.7)",
                          margin: "6px 0 0",
                        }}
                      >
                        {review.comment}
                      </p>
                    ) : null}
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: 11,
                        color: "rgba(238,234,228,0.4)",
                        margin: "8px 0 0",
                      }}
                    >
                      {formatDate(review.updatedAt)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
