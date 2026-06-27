import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBackdropUrl,
  getBrCertification,
  getDirectors,
  getMovieFull,
  getPosterUrl,
  getProfileUrl,
  getTrailerKey,
  getWriters,
  type TmdbMovieFull,
} from "@/lib/tmdb";
import { SiteNav } from "@/components/SiteNav";
import { RatingStars } from "@/components/RatingStars";
import styles from "./filme.module.css";

async function loadMovie(idParam: string): Promise<TmdbMovieFull | null> {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    return await getMovieFull(id);
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
  if (!movie) return { title: "Filme não encontrado · ReelRate" };
  return {
    title: `${movie.title} · ReelRate`,
    description: movie.overview || `Detalhes, elenco e críticas de ${movie.title} no ReelRate.`,
  };
}

function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const AVATAR_PALETTE = ["#c0392b", "#2c5f6f", "#8a6d1f", "#5c4a8a", "#3d7a4a"];

function paletteColor(seed: number): string {
  return AVATAR_PALETTE[seed % AVATAR_PALETTE.length];
}

function languageName(code: string): string {
  try {
    return new Intl.DisplayNames(["pt-BR"], { type: "language" }).of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatVoteCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}mil`;
  return String(n);
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await loadMovie(id);
  if (!movie) notFound();

  const year = movie.release_date ? String(new Date(movie.release_date).getFullYear()) : null;
  const runtime = formatRuntime(movie.runtime);
  const certification = getBrCertification(movie);
  const directors = getDirectors(movie);
  const writers = getWriters(movie);
  const countries = movie.production_countries.map((c) => c.name);
  const backdropUrl = getBackdropUrl(movie.backdrop_path, "original");
  const posterUrl = getPosterUrl(movie.poster_path);
  const trailerKey = getTrailerKey(movie);
  const cast = movie.credits.cast.slice(0, 12);
  const gallery = movie.images.backdrops.slice(0, 6);
  const extraGalleryCount = movie.images.backdrops.length - gallery.length;
  const reviews = movie.reviews.results.slice(0, 3);
  const similar = movie.similar.results.slice(0, 8);

  const circumference = 2 * Math.PI * 50;
  const arcOffset = circumference * (1 - movie.vote_average / 10);

  return (
    <main style={{ background: "#0a0a0e", color: "#eeeae4", minHeight: "100vh" }}>
      <SiteNav active="filmes" />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: 640, paddingTop: 72 }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {backdropUrl ? (
            <Image src={backdropUrl} alt={movie.title} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)" }} />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, #0a0a0e 0%, rgba(10,10,14,0.85) 28%, rgba(10,10,14,0.45) 55%, rgba(10,10,14,0.75) 100%)",
            }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "96px 48px 64px" }}>
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link href="/filmes" className={styles.backLink} style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "rgba(238,234,228,0.5)", textDecoration: "none" }}>
              Explorar
            </Link>
            <span style={{ color: "rgba(238,234,228,0.3)", fontSize: 12 }}>/</span>
            <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "rgba(238,234,228,0.5)" }}>
              {movie.genres[0]?.name ?? "Filme"}
            </span>
            <span style={{ color: "rgba(238,234,228,0.3)", fontSize: 12 }}>/</span>
            <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "rgba(238,234,228,0.75)" }}>
              {movie.title}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(40px, 6vw, 76px)",
              lineHeight: 1.05,
              letterSpacing: 1,
              margin: "0 0 16px",
              textTransform: "uppercase",
              color: "#eeeae4",
              textShadow: "0 8px 32px rgba(0,0,0,0.6)",
              maxWidth: 880,
            }}
          >
            {movie.title}
          </h1>

          {movie.tagline && (
            <p style={{ fontFamily: "var(--font-playfair), serif", fontStyle: "italic", fontSize: 18, color: "rgba(238,234,228,0.7)", margin: "0 0 22px", maxWidth: 600 }}>
              {movie.tagline}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            {year && <MetaPill>{year}</MetaPill>}
            {certification && <MetaPill>{certification}</MetaPill>}
            {runtime && <MetaPill>{runtime}</MetaPill>}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RatingStars rating={(movie.vote_average / 2).toFixed(1)} />
              <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 13, color: "#d4a017" }}>
                {movie.vote_average.toFixed(1)}/10
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
                style={{
                  fontFamily: "var(--font-lato), sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#fff",
                  background: "#c0392b",
                  border: "none",
                  borderRadius: 4,
                  padding: "14px 28px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                ▶ Ver trailer
              </a>
            )}
            <button
              className={styles.btnSecondary}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#eeeae4",
                background: "transparent",
                border: "1px solid rgba(238,234,228,0.3)",
                borderRadius: 4,
                padding: "14px 28px",
                cursor: "pointer",
              }}
            >
              + Minha Lista
            </button>
            <button
              aria-label="Favoritar"
              className={styles.iconBtn}
              style={{
                width: 48,
                height: 48,
                borderRadius: 4,
                border: "1px solid rgba(238,234,228,0.3)",
                background: "transparent",
                color: "rgba(238,234,228,0.8)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ♥
            </button>
          </div>
        </div>
      </section>

      {/* INFO PRINCIPAL */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 220px", gap: 48 }}>
          <div
            style={{
              position: "relative",
              aspectRatio: "2 / 3",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
              background: posterUrl ? "#1a1a1e" : "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)",
            }}
          >
            {posterUrl && (
              <Image src={posterUrl} alt={movie.title} fill sizes="240px" style={{ objectFit: "cover" }} />
            )}
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 24, letterSpacing: 1, margin: "0 0 16px", color: "#eeeae4" }}>
              Sinopse
            </h2>
            <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 15, lineHeight: 1.7, color: "rgba(238,234,228,0.7)", margin: "0 0 28px", maxWidth: 640 }}>
              {movie.overview || "Esse filme ainda não tem uma sinopse disponível na TMDB."}
            </p>

            {movie.genres.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: 11,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      padding: "7px 14px",
                      borderRadius: 20,
                      border: "1px solid rgba(192,57,43,0.4)",
                      background: "rgba(192,57,43,0.1)",
                      color: "#eeeae4",
                    }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24, maxWidth: 560 }}>
              <InfoField label="Direção" value={directors.length ? directors.join(", ") : "—"} />
              <InfoField label="Roteiro" value={writers.length ? writers.join(", ") : "—"} />
              <InfoField label="País / Ano" value={[countries.join(", "), year].filter(Boolean).join(", ") || "—"} />
              <InfoField label="Idioma original" value={languageName(movie.original_language)} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(238,234,228,0.08)" strokeWidth={8} />
              <circle
                cx={60}
                cy={60}
                r={50}
                fill="none"
                stroke="#d4a017"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={arcOffset}
              />
            </svg>
            <div style={{ marginTop: -78, marginBottom: 56, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, margin: 0, color: "#eeeae4" }}>
                {movie.vote_average.toFixed(1)}
              </p>
              <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 10, margin: 0, color: "rgba(238,234,228,0.4)" }}>
                / 10
              </p>
            </div>
            <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", color: "rgba(238,234,228,0.45)", margin: "0 0 4px", textAlign: "center" }}>
              Nota TMDB
            </p>
            <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 12, color: "rgba(238,234,228,0.4)", margin: 0, textAlign: "center" }}>
              {formatVoteCount(movie.vote_count)} avaliações
            </p>
          </div>
        </div>
      </section>

      {/* ELENCO */}
      {cast.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 80px" }}>
          <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, letterSpacing: 1, margin: "0 0 28px", color: "#eeeae4" }}>
            Elenco
          </h2>
          <div className={styles.scrollRow} style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8 }}>
            {cast.map((member) => {
              const profileUrl = getProfileUrl(member.profile_path);
              return (
                <div key={member.id} className={styles.castCard} style={{ flexShrink: 0, width: 130 }}>
                  <div
                    style={{
                      position: "relative",
                      width: 130,
                      height: 130,
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginBottom: 12,
                      background: paletteColor(member.id),
                    }}
                  >
                    {profileUrl ? (
                      <Image src={profileUrl} alt={member.name} fill sizes="130px" style={{ objectFit: "cover" }} />
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-bebas), sans-serif",
                          fontSize: 30,
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        {initials(member.name)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-lato), sans-serif", fontWeight: 700, fontSize: 13, margin: "0 0 2px", color: "#eeeae4", textAlign: "center" }}>
                    {member.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 12, margin: 0, color: "rgba(238,234,228,0.5)", textAlign: "center" }}>
                    {member.character}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* GALERIA */}
      {gallery.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 80px" }}>
          <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, letterSpacing: 1, margin: "0 0 28px", color: "#eeeae4" }}>
            Galeria
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {gallery.map((image, index) => {
              const isLast = index === gallery.length - 1 && extraGalleryCount > 0;
              const url = getBackdropUrl(image.file_path, "w1280");
              return (
                <div
                  key={image.file_path}
                  className={styles.galleryItem}
                  style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 6, overflow: "hidden" }}
                >
                  {url && <Image src={url} alt={`${movie.title} — foto ${index + 1}`} fill sizes="320px" style={{ objectFit: "cover" }} />}
                  {isLast && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(10,10,14,0.6)",
                        fontFamily: "var(--font-bebas), sans-serif",
                        fontSize: 22,
                        color: "#eeeae4",
                      }}
                    >
                      +{extraGalleryCount} fotos
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CRÍTICAS */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 80px" }}>
        <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, letterSpacing: 1, margin: "0 0 28px", color: "#eeeae4" }}>
          Críticas
        </h2>
        {reviews.length === 0 ? (
          <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 14, color: "rgba(238,234,228,0.5)" }}>
            Ainda não há críticas para este filme na TMDB.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {reviews.map((review) => {
              const rating = review.author_details.rating;
              return (
                <div
                  key={review.id}
                  className={styles.reviewCard}
                  style={{ border: "1px solid rgba(238,234,228,0.08)", borderRadius: 8, padding: 24, background: "rgba(238,234,228,0.02)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: paletteColor(review.author.length),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-bebas), sans-serif",
                        fontSize: 13,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {initials(review.author)}
                    </span>
                    <div>
                      <p style={{ fontFamily: "var(--font-lato), sans-serif", fontWeight: 700, fontSize: 13, margin: 0, color: "#eeeae4" }}>
                        {review.author}
                      </p>
                      <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, margin: 0, color: "rgba(238,234,228,0.4)" }}>
                        {formatReviewDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  {rating !== null && (
                    <div style={{ marginBottom: 10 }}>
                      <RatingStars rating={(rating / 2).toFixed(1)} />
                    </div>
                  )}
                  <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 14, lineHeight: 1.6, color: "rgba(238,234,228,0.65)", margin: 0 }}>
                    {review.content.length > 280 ? `${review.content.slice(0, 280).trim()}…` : review.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SIMILARES */}
      {similar.length > 0 && (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px 100px" }}>
          <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 32, letterSpacing: 1, margin: "0 0 28px", color: "#eeeae4" }}>
            Filmes similares
          </h2>
          <div className={styles.scrollRow} style={{ display: "flex", gap: 24, overflowX: "auto", paddingBottom: 8 }}>
            {similar.map((film) => {
              const filmPoster = getPosterUrl(film.poster_path);
              return (
                <Link
                  key={film.id}
                  href={`/filmes/${film.id}`}
                  className={styles.similarCard}
                  style={{ flexShrink: 0, width: 180, textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "2 / 3",
                      borderRadius: 6,
                      overflow: "hidden",
                      marginBottom: 12,
                      boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
                      background: filmPoster ? "#1a1a1e" : "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)",
                    }}
                  >
                    {filmPoster && (
                      <Image src={filmPoster} alt={film.title} fill sizes="180px" style={{ objectFit: "cover" }} />
                    )}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 600, fontSize: 15, margin: "0 0 6px", color: "#eeeae4" }}>
                    {film.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <RatingStars rating={(film.vote_average / 2).toFixed(1)} />
                    <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "rgba(238,234,228,0.4)" }}>
                      {film.vote_average.toFixed(1)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(238,234,228,0.08)",
          padding: "48px 48px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <Link href="/" style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 20, color: "rgba(238,234,228,0.6)", textDecoration: "none" }}>
          Reel<span style={{ color: "#c0392b" }}>Rate</span>
        </Link>
        <div style={{ display: "flex", gap: 28 }}>
          {["Sobre", "Privacidade", "Termos", "Contato"].map((item) => (
            <a
              key={item}
              href="#"
              className={styles.footerLink}
              style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 13, color: "rgba(238,234,228,0.45)", textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-space-mono), monospace",
        fontSize: 13,
        color: "rgba(238,234,228,0.75)",
        padding: "6px 12px",
        border: "1px solid rgba(238,234,228,0.2)",
        borderRadius: 4,
      }}
    >
      {children}
    </span>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: "rgba(238,234,228,0.4)", margin: "0 0 6px" }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 14, margin: 0, color: "#eeeae4" }}>
        {value}
      </p>
    </div>
  );
}
