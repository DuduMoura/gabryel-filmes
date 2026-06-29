import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";
import { getMovieDetails, getPosterUrl } from "@/lib/tmdb";
import { SiteNav } from "@/components/SiteNav";
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

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_tmdbMovieId: {
        userId: session.user.id,
        tmdbMovieId: movie.id,
      },
    },
  });

  const posterUrl = getPosterUrl(movie.poster_path, "w342");

  return (
    <main style={{ background: "#0a0a0e", color: "#eeeae4", minHeight: "100vh" }}>
      <SiteNav active="filmes" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "140px 48px 80px" }}>
        <Link
          href={`/filmes/${movie.id}`}
          style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "rgba(238,234,228,0.5)", textDecoration: "none" }}
        >
          ← Voltar para {movie.title}
        </Link>

        <div style={{ display: "flex", gap: 24, alignItems: "center", margin: "24px 0 40px" }}>
          <div
            style={{
              position: "relative",
              width: 76,
              height: 114,
              borderRadius: 6,
              overflow: "hidden",
              flexShrink: 0,
              background: posterUrl ? "#1a1a1e" : "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)",
            }}
          >
            {posterUrl && <Image src={posterUrl} alt={movie.title} fill sizes="76px" style={{ objectFit: "cover" }} />}
          </div>
          <div>
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
              {existingReview ? "Editar avaliação" : "Avaliar"}
            </p>
            <h1 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, letterSpacing: 0.5, margin: 0 }}>
              {movie.title}
            </h1>
          </div>
        </div>

        <ReviewForm
          tmdbMovieId={movie.id}
          reviewId={existingReview?.id}
          initialRating={existingReview?.rating ?? 0}
          initialComment={existingReview?.comment ?? ""}
        />
      </div>
    </main>
  );
}
