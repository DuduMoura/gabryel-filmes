"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/filmes/explore.module.css";
import { RatingStars } from "@/components/RatingStars";
import { loadMoreFilms } from "@/app/filmes/actions";
import type { ExploreFilm, ExplorePageInfo, ExploreTabId } from "@/lib/explore";

type SortBy = "rating" | "recent" | "title" | "popular";

const TAB_DEFS: { id: ExploreTabId; label: string; icon: string }[] = [
  { id: "top", label: "Melhores Avaliados", icon: "★" },
  { id: "new", label: "Lançamentos", icon: "✦" },
  { id: "week", label: "Em Alta", icon: "▲" },
  { id: "nowplay", label: "Em Cartaz", icon: "▶" },
  { id: "acclaimed", label: "Aclamados", icon: "◆" },
];

const SORT_OPTIONS: { id: SortBy; label: string }[] = [
  { id: "rating", label: "Melhor Avaliação" },
  { id: "recent", label: "Mais Recentes" },
  { id: "title", label: "Título A-Z" },
  { id: "popular", label: "Mais Populares" },
];

const RANK_COLORS: Record<number, string> = { 1: "#d4a017", 2: "#c4c4c4", 3: "#b87333" };

function formatReviews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}mil avaliações`;
  return `${n} avaliações`;
}

function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx={20} cy={20} r={17} stroke="#c0392b" strokeWidth={1.5} />
      <circle cx={20} cy={20} r={3} fill="#c0392b" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={20 + Math.cos(angle) * 13}
            cy={20 + Math.sin(angle) * 13}
            r={1.6}
            fill="#c0392b"
          />
        );
      })}
    </svg>
  );
}

function mergeFilms(prev: ExploreFilm[], incoming: ExploreFilm[], tab: ExploreTabId): ExploreFilm[] {
  const byId = new Map(prev.map((film) => [film.id, film]));
  for (const film of incoming) {
    const existing = byId.get(film.id);
    if (existing) {
      if (!existing.tags.includes(tab)) existing.tags.push(tab);
      continue;
    }
    byId.set(film.id, film);
  }
  return Array.from(byId.values());
}

export function ExploreFilms({ films: initialFilms, pageInfo: initialPageInfo }: { films: ExploreFilm[]; pageInfo: ExplorePageInfo }) {
  const [films, setFilms] = useState(initialFilms);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [activeTab, setActiveTab] = useState<ExploreTabId>("top");
  const [activeGenre, setActiveGenre] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [isLoadingMore, startLoadMore] = useTransition();

  const activePageInfo = pageInfo[activeTab];
  const hasMore = activePageInfo.page < activePageInfo.totalPages;

  const handleLoadMore = () => {
    const nextPage = activePageInfo.page + 1;
    startLoadMore(async () => {
      const result = await loadMoreFilms(activeTab, nextPage);
      setFilms((prev) => mergeFilms(prev, result.films, activeTab));
      setPageInfo((prev) => ({
        ...prev,
        [activeTab]: { page: nextPage, totalPages: result.totalPages, totalResults: result.totalResults },
      }));
    });
  };

  const tabFilms = films.filter((film) => film.tags.includes(activeTab));

  const genreSet = new Set(tabFilms.map((film) => film.genre));
  const genres = ["Todos", ...Array.from(genreSet).sort((a, b) => a.localeCompare(b))];

  const genreFiltered =
    activeGenre === "Todos" ? tabFilms : tabFilms.filter((film) => film.genre === activeGenre);

  const query = search.trim().toLowerCase();
  const searched = query
    ? genreFiltered.filter(
        (film) =>
          film.title.toLowerCase().includes(query) ||
          film.genre.toLowerCase().includes(query) ||
          film.year.includes(query),
      )
    : genreFiltered;

  const sorted = [...searched].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "recent") return Number(b.year) - Number(a.year);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return b.reviews - a.reviews;
  });

  const showRankBadges =
    activeTab === "top" && activeGenre === "Todos" && !query && sortBy === "rating";

  const handleClearFilters = () => {
    setActiveGenre("Todos");
    setSearch("");
  };

  return (
    <main style={{ background: "#0a0a0e", color: "#eeeae4", minHeight: "100vh" }}>
      {/* HEADER */}
      <section style={{ padding: "128px 48px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 12,
            color: "rgba(238,234,228,0.5)",
            textDecoration: "none",
          }}
        >
          ← Voltar para o início
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 48,
            letterSpacing: 1,
            margin: "16px 0 12px",
            color: "#eeeae4",
          }}
        >
          Explorar filmes
        </h1>
        <p
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontStyle: "italic",
            fontSize: 17,
            color: "rgba(238,234,228,0.6)",
            margin: "0 0 28px",
            maxWidth: 540,
          }}
        >
          Navegue pelas categorias, filtre por gênero e encontre o próximo filme do seu diário.
        </p>
        <div style={{ position: "relative", maxWidth: 420 }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(238,234,228,0.4)",
              fontSize: 14,
            }}
          >
            ⚲
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, gênero ou ano..."
            className={styles.searchInput}
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              borderRadius: 6,
              border: "1px solid rgba(238,234,228,0.15)",
              background: "rgba(238,234,228,0.03)",
              color: "#eeeae4",
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 14,
            }}
          />
        </div>
      </section>

      {/* STICKY TABS + GENRES */}
      <div
        style={{
          position: "sticky",
          top: 72,
          zIndex: 40,
          background: "rgba(10,10,14,0.96)",
          borderTop: "1px solid rgba(238,234,228,0.08)",
          borderBottom: "1px solid rgba(238,234,228,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 48px",
            display: "flex",
            gap: 4,
            overflowX: "auto",
          }}
        >
          {TAB_DEFS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveGenre("Todos");
                }}
                className={styles.tabBtn}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                  padding: "16px 18px",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid #c0392b" : "2px solid transparent",
                  color: isActive ? "#eeeae4" : "rgba(238,234,228,0.55)",
                  fontFamily: "var(--font-lato), sans-serif",
                  fontWeight: isActive ? 700 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <span style={{ color: isActive ? "#c0392b" : "inherit", fontSize: 13 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 48px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {genres.map((genre) => {
            const isActive = genre === activeGenre;
            return (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={styles.genreChip}
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: 11,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  padding: "7px 14px",
                  borderRadius: 20,
                  border: isActive ? "1px solid #c0392b" : "1px solid rgba(238,234,228,0.15)",
                  background: isActive ? "rgba(192,57,43,0.12)" : "transparent",
                  color: isActive ? "#eeeae4" : "rgba(238,234,228,0.6)",
                  cursor: "pointer",
                }}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS BAR */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "28px 48px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 14,
            color: "rgba(238,234,228,0.55)",
            margin: 0,
          }}
        >
          {sorted.length} {sorted.length === 1 ? "filme" : "filmes"} em{" "}
          <span style={{ color: "#eeeae4" }}>{TAB_DEFS.find((t) => t.id === activeTab)?.label}</span>
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className={styles.sortSelect}
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 13,
            color: "#eeeae4",
            background: "#15151a",
            border: "1px solid rgba(238,234,228,0.15)",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* GRID / EMPTY STATE */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 48px 100px" }}>
        {sorted.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "80px 0",
              opacity: 0.7,
            }}
          >
            <svg width={64} height={64} viewBox="0 0 40 40" fill="none" style={{ opacity: 0.3, marginBottom: 24 }}>
              <circle cx={20} cy={20} r={17} stroke="#eeeae4" strokeWidth={1.5} />
              <circle cx={20} cy={20} r={3} fill="#eeeae4" />
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={20 + Math.cos(angle) * 13}
                    cy={20 + Math.sin(angle) * 13}
                    r={1.6}
                    fill="#eeeae4"
                  />
                );
              })}
            </svg>
            <h2
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: 24,
                letterSpacing: 1,
                color: "rgba(238,234,228,0.65)",
                margin: "0 0 24px",
              }}
            >
              NENHUM FILME ENCONTRADO
            </h2>
            <button
              onClick={handleClearFilters}
              className={styles.clearBtn}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                background: "#c0392b",
                border: "none",
                borderRadius: 4,
                padding: "12px 28px",
                cursor: "pointer",
              }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 28,
            }}
          >
            {sorted.map((film, index) => {
              const rank = index + 1;
              const showRank = showRankBadges && rank <= 3;
              return (
                <Link
                  key={film.id}
                  href={`/filmes/${film.id}`}
                  className={styles.filmCard}
                  style={{ display: "block", textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "2 / 3",
                      borderRadius: 6,
                      overflow: "hidden",
                      marginBottom: 14,
                      boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
                      background: film.posterUrl
                        ? "#1a1a1e"
                        : "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)",
                    }}
                  >
                    {film.posterUrl && (
                      <Image
                        src={film.posterUrl}
                        alt={film.title}
                        fill
                        sizes="(max-width: 768px) 45vw, 220px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#d4a017",
                        background: "rgba(10,10,14,0.75)",
                        padding: "4px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {film.rating.toFixed(1)}
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        color: "#eeeae4",
                        background: "rgba(10,10,14,0.65)",
                        padding: "4px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {film.genre}
                    </span>
                    {showRank && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          fontFamily: "var(--font-bebas), sans-serif",
                          fontSize: 22,
                          color: "#0a0a0e",
                          background: RANK_COLORS[rank],
                          padding: "4px 14px 4px 10px",
                          borderTopRightRadius: 10,
                        }}
                      >
                        #{rank}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 600,
                      fontSize: 18,
                      margin: "0 0 4px",
                      color: "#eeeae4",
                    }}
                  >
                    {film.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-lato), sans-serif",
                      fontSize: 13,
                      color: "rgba(238,234,228,0.5)",
                      margin: "0 0 8px",
                    }}
                  >
                    {film.year}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RatingStars rating={(film.rating / 2).toFixed(1)} />
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: 11,
                        color: "rgba(238,234,228,0.4)",
                      }}
                    >
                      {formatReviews(film.reviews)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {sorted.length > 0 && hasMore && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 48 }}>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={styles.clearBtn}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#eeeae4",
                background: "transparent",
                border: "1px solid rgba(238,234,228,0.25)",
                borderRadius: 4,
                padding: "12px 32px",
                cursor: isLoadingMore ? "default" : "pointer",
                opacity: isLoadingMore ? 0.6 : 1,
              }}
            >
              {isLoadingMore ? "Carregando..." : "Carregar mais filmes"}
            </button>
            <span
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: 11,
                color: "rgba(238,234,228,0.4)",
              }}
            >
              {films.filter((film) => film.tags.includes(activeTab)).length} de {activePageInfo.totalResults}
            </span>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(238,234,228,0.08)",
          padding: "56px 48px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 48,
            marginBottom: 40,
          }}
        >
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <LogoMark />
            <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 22, color: "rgba(238,234,228,0.7)" }}>
              Reel<span style={{ color: "#c0392b" }}>Rate</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "rgba(238,234,228,0.4)",
                  margin: "0 0 14px",
                }}
              >
                Plataforma
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Explorar", href: "/filmes" },
                  { label: "Diário", href: "#" },
                  { label: "Listas", href: "#" },
                  { label: "Comunidade", href: "#" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={styles.footerLink}
                    style={{
                      fontFamily: "var(--font-lato), sans-serif",
                      fontSize: 13,
                      color: "rgba(238,234,228,0.55)",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "rgba(238,234,228,0.4)",
                  margin: "0 0 14px",
                }}
              >
                Empresa
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Sobre", "Privacidade", "Termos", "Contato"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={styles.footerLink}
                    style={{
                      fontFamily: "var(--font-lato), sans-serif",
                      fontSize: 13,
                      color: "rgba(238,234,228,0.55)",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            borderTop: "1px solid rgba(238,234,228,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              color: "rgba(238,234,228,0.35)",
            }}
          >
            © 2026 ReelRate. Todos os direitos reservados.
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              color: "rgba(238,234,228,0.35)",
            }}
          >
            Dados de filmes fornecidos pela TMDB
          </span>
        </div>
      </footer>
    </main>
  );
}
