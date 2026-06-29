import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";
import { getMovieDetails, getPosterUrl } from "@/lib/tmdb";
import { SiteNav } from "@/components/SiteNav";
import { RatingStars } from "@/components/RatingStars";
import { ReviewForm } from "@/components/ReviewForm";

async function loadMovie(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    return await getMovieDetails(id);
  } catch (error) {
    console.error(`Falha ao buscar o filme ${idParam} na TMDB:`, error);
    return null;
  }
}

function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await loadMovie(id);
  if (!movie) return { title: "Avaliar filme · ReelRate" };
  return { title: `Avaliar ${movie.title} · ReelRate` };
}

export default async function AvaliarFilmePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await requireUserSession();
  if (!session) redirect(`/login?callbackUrl=/filmes/${id}/avaliar`);

  const movie = await loadMovie(id);
  if (!movie) notFound();

  const [existingReview, stats] = await Promise.all([
    prisma.review.findUnique({
      where: {
        userId_tmdbMovieId: {
          userId: session.user.id,
          tmdbMovieId: movie.id,
        },
      },
    }),
    prisma.review.aggregate({
      where: { tmdbMovieId: movie.id },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  const posterUrl = getPosterUrl(movie.poster_path, "w342");
  const year = movie.release_date ? String(new Date(movie.release_date).getFullYear()) : null;
  const runtime = formatRuntime(movie.runtime);
  const avgRating = stats._avg.rating ?? 0;
  const reviewCount = stats._count.rating;

  return (
    <main style={{ background: "#0a0a0e", color: "#eeeae4", minHeight: "100vh" }}>
      <SiteNav active="filmes" />

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "140px 48px 96px" }}>
        <Link
          href={`/filmes/${movie.id}`}
          style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "rgba(238,234,228,0.5)", textDecoration: "none" }}
        >
          ← Voltar para {movie.title}
        </Link>

        <div style={{ display: "flex", gap: 56, marginTop: 32, alignItems: "flex-start" }}>
          {/* Sidebar: ficha do filme */}
          <aside style={{ width: 260, flexShrink: 0, position: "sticky", top: 112 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "2 / 3",
                borderRadius: 8,
                overflow: "hidden",
                background: posterUrl ? "#1a1a1e" : "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
              }}
            >
              {posterUrl && <Image src={posterUrl} alt={movie.title} fill sizes="260px" style={{ objectFit: "cover" }} />}
            </div>

            <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 24, letterSpacing: 0.5, margin: "20px 0 4px" }}>
              {movie.title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 11,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: "rgba(238,234,228,0.45)",
                margin: "0 0 16px",
              }}
            >
              {[year, runtime].filter(Boolean).join(" · ")}
            </p>

            {movie.genres.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: 10,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      color: "rgba(238,234,228,0.6)",
                      border: "1px solid rgba(238,234,228,0.15)",
                      borderRadius: 20,
                      padding: "4px 10px",
                    }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                border: "1px solid rgba(238,234,228,0.1)",
                borderRadius: 10,
                padding: 16,
                marginBottom: existingReview ? 16 : 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: 10,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  color: "rgba(238,234,228,0.45)",
                  margin: "0 0 8px",
                }}
              >
                Nota da comunidade
              </p>
              {reviewCount > 0 ? (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, color: "#d4a017" }}>
                      {avgRating.toFixed(1)}
                    </span>
                    <RatingStars rating={String(avgRating)} />
                  </div>
                  <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 12, color: "rgba(238,234,228,0.5)", margin: 0 }}>
                    {reviewCount} {reviewCount === 1 ? "avaliação" : "avaliações"}
                  </p>
                </>
              ) : (
                <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 13, color: "rgba(238,234,228,0.5)", margin: 0 }}>
                  Seja o primeiro a avaliar este filme.
                </p>
              )}
            </div>

            {existingReview && (
              <div
                style={{
                  border: "1px solid rgba(212,160,23,0.25)",
                  background: "rgba(212,160,23,0.06)",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 10,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    color: "rgba(212,160,23,0.8)",
                    margin: "0 0 8px",
                  }}
                >
                  Sua avaliação anterior
                </p>
                <div style={{ marginBottom: 6 }}>
                  <RatingStars rating={String(existingReview.rating)} />
                </div>
                <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 12, color: "rgba(238,234,228,0.5)", margin: 0 }}>
                  Avaliado em {formatDate(existingReview.updatedAt)}
                </p>
              </div>
            )}
          </aside>

          {/* Formulário */}
          <div style={{ flex: 1, maxWidth: 520 }}>
            <p
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 11,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: "rgba(238,234,228,0.45)",
                margin: "0 0 6px",
              }}
            >
              {existingReview ? "Editar avaliação" : "Nova avaliação"}
            </p>
            <h1 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, letterSpacing: 0.5, margin: "0 0 32px" }}>
              O que você achou de {movie.title}?
            </h1>

            <ReviewForm
              tmdbMovieId={movie.id}
              reviewId={existingReview?.id}
              initialRating={existingReview?.rating ?? 0}
              initialComment={existingReview?.comment ?? ""}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
