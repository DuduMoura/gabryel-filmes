import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import {
  getMovieDirector,
  getPosterUrl,
  getTopVotedMovies,
  type TmdbMovieWithCredits,
} from "@/lib/tmdb";
import { MovieCard } from "@/components/MovieCard";
import { RatingStars } from "@/components/RatingStars";
import { SiteNav } from "@/components/SiteNav";

/* ---- Cena "Tela como cor": poltronas em perspectiva sob o brilho colorido da tela ---- */

const SEAT_FILL = "linear-gradient(180deg,#3a1418 0%,#1a0a0c 60%,#0c0506 100%)";
const SEAT_RIM = "rgba(232,150,96,.42)";

function Seat() {
  return (
    <div style={{ flex: "1 1 0", minWidth: 0, display: "flex" }}>
      <div
        style={{
          flex: "1 1 0",
          minWidth: 0,
          height: 72,
          borderRadius: "16px 16px 5px 5px",
          background: SEAT_FILL,
          boxShadow: `inset 0 3px 0 ${SEAT_RIM}, inset 0 -16px 22px rgba(0,0,0,.55), 0 8px 18px rgba(0,0,0,.5)`,
        }}
      />
    </div>
  );
}

function SeatRows({ count = 6, perRow = 9, frontBlur = 9 }: { count?: number; perRow?: number; frontBlur?: number }) {
  const rows = [];
  for (let r = 0; r < count; r++) {
    const t = r / (count - 1);
    const scale = 1.55 - t * 1.15;
    const y = 100 - t * 38;
    const blur = frontBlur - t * (frontBlur - 0.4);
    const w = 124 - t * 76;
    rows.push(
      <div
        key={r}
        style={{
          position: "absolute",
          left: "50%",
          top: `${y}%`,
          width: `${w}%`,
          transform: `translate(-50%,-50%) scale(${scale})`,
          display: "flex",
          gap: 20,
          justifyContent: "center",
          filter: `blur(${blur}px)`,
          zIndex: Math.round((1 - t) * 100),
        }}
      >
        {Array.from({ length: perRow }, (_, s) => (
          <Seat key={s} />
        ))}
      </div>,
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        WebkitMaskImage: "linear-gradient(to top, #000 64%, transparent 92%)",
        maskImage: "linear-gradient(to top, #000 64%, transparent 92%)",
      }}
    >
      {rows}
    </div>
  );
}

function DustMotes({ n = 10 }: { n?: number }) {
  let seed = 91;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const motes = [];
  for (let i = 0; i < n; i++) {
    const sz = 2 + rnd() * 4;
    motes.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${20 + rnd() * 60}%`,
          top: `${8 + rnd() * 52}%`,
          width: sz,
          height: sz,
          borderRadius: "50%",
          background: "rgba(212,160,23,.5)",
          filter: "blur(1px)",
          opacity: 0.3 + rnd() * 0.5,
          animation: `rr-dust ${5 + rnd() * 6}s ease-in-out ${rnd() * 4}s infinite alternate`,
        }}
      />,
    );
  }
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{motes}</div>;
}

type FeaturedFilm = {
  id: number;
  title: string;
  posterUrl: string | null;
  director: string | null;
  releaseDateLabel: string | null;
  genreLabel: string | null;
  voteAverage: number;
};

function toFeaturedFilm(movie: TmdbMovieWithCredits): FeaturedFilm {
  return {
    id: movie.id,
    title: movie.title,
    posterUrl: getPosterUrl(movie.poster_path),
    director: getMovieDirector(movie),
    releaseDateLabel: movie.release_date
      ? new Date(movie.release_date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : null,
    genreLabel: movie.genres.length ? movie.genres.slice(0, 2).map((g) => g.name).join(" / ") : null,
    voteAverage: movie.vote_average,
  };
}

async function getFeaturedFilms(): Promise<FeaturedFilm[]> {
  try {
    const movies = await getTopVotedMovies(6);
    return movies.map(toFeaturedFilm);
  } catch (error) {
    console.error("Falha ao buscar filmes em destaque na TMDB:", error);
    return [];
  }
}

type Review = {
  user: string;
  filmTitle: string;
  rating: string;
  excerpt: string;
  date: string;
  avatarUrl: string;
};

const reviews: Review[] = [
  {
    user: "marina.cine",
    filmTitle: "A Sombra do Projetor",
    rating: "4.5",
    excerpt: "Um estudo silencioso sobre memória e perda. A fotografia carrega cada cena com um peso quase físico.",
    date: "há 2 dias",
    avatarUrl: "/images/usuarios/pexels-helen-ray-319601696-15572175.jpg",
  },
  {
    user: "joaopedro_filmes",
    filmTitle: "O Último Rolo",
    rating: "5.0",
    excerpt: "Não esperava ser surpreendido assim. O terceiro ato muda tudo o que você pensava sobre os personagens.",
    date: "há 3 dias",
    avatarUrl: "/images/usuarios/pexels-tomi-exposures-2159993120-37296940.jpg",
  },
  {
    user: "luisa_assiste",
    filmTitle: "Luzes de Outubro",
    rating: "4.0",
    excerpt: "Romance sem pressa, construído em pequenos gestos. A trilha sonora faz todo o trabalho emocional.",
    date: "há 5 dias",
    avatarUrl: "/images/usuarios/pexels-kema-20624777.jpg",
  },
  {
    user: "bernardo.rolo",
    filmTitle: "Negativo",
    rating: "3.5",
    excerpt: "Tensão bem construída na primeira hora, mas perde força no final. Ainda assim, valioso pela atmosfera.",
    date: "há 6 dias",
    avatarUrl: "/images/usuarios/pexels-kate-andreeshcheva-35129697-9169048.jpg",
  },
];

type DiaryEntry = {
  day: string;
  month: string;
  title: string;
  year: string;
  rating: string;
  rewatch: boolean;
};

const diary: DiaryEntry[] = [
  { day: "22", month: "JUN", title: "A Sombra do Projetor", year: "2019", rating: "4.5", rewatch: false },
  { day: "20", month: "JUN", title: "Sessão das Onze", year: "2015", rating: "4.5", rewatch: true },
  { day: "18", month: "JUN", title: "Carretel Azul", year: "2023", rating: "3.5", rewatch: false },
  { day: "15", month: "JUN", title: "O Último Rolo", year: "2017", rating: "5.0", rewatch: false },
  { day: "12", month: "JUN", title: "Luzes de Outubro", year: "2021", rating: "4.0", rewatch: true },
];

type FilmList = { title: string; count: number; curator: string };

const lists: FilmList[] = [
  { title: "Essenciais do Cinema Noir", count: 28, curator: "marina.cine" },
  { title: "Para uma noite chuvosa", count: 14, curator: "joaopedro_filmes" },
  { title: "Estreias que marcaram 2023", count: 19, curator: "luisa_assiste" },
];

function FilmStripFrame({ colors, labels }: { colors: string[]; labels: string[] }) {
  const holeXs = Array.from({ length: 20 }, (_, i) => 7 + i * 40);
  const rectXs = [28, 212, 396, 580];
  const labelXs = [186, 370, 554, 738];

  return (
    <svg width={800} height={110} viewBox="0 0 800 110" style={{ flexShrink: 0 }}>
      <rect width={800} height={110} fill="#15100a" />
      {holeXs.map((x) => (
        <rect key={`top-${x}`} x={x} y={5} width={16} height={13} rx={3} fill="#0a0a0e" />
      ))}
      {holeXs.map((x) => (
        <rect key={`bot-${x}`} x={x} y={92} width={16} height={13} rx={3} fill="#0a0a0e" />
      ))}
      {rectXs.map((x, i) => (
        <rect key={x} x={x} y={24} width={170} height={62} rx={2} fill={colors[i]} />
      ))}
      {labelXs.map((x, i) => (
        <text
          key={x}
          x={x}
          y={91}
          textAnchor="end"
          style={{ fill: "#b89030", fontSize: 7, fontFamily: "var(--font-space-mono), monospace" }}
        >
          {labels[i]}
        </text>
      ))}
    </svg>
  );
}

function CinemaScreenScene() {
  return (
    <div className={styles.seatGroup} style={{ position: "absolute", inset: 0 }}>
      {/* lavagem de cor descendo do topo (vermelho + dourado) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 56% at 50% 4%, rgba(192,57,43,.28), transparent 60%), radial-gradient(ellipse 50% 40% at 50% 2%, rgba(212,160,23,.2), transparent 58%)",
        }}
      />

      {/* a tela: um brilho de cor difuso (laranja -> vermelho -> dourado) */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "64%",
          height: "56%",
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(232,120,96,.55) 0%, rgba(192,57,43,.4) 32%, rgba(212,160,23,.2) 56%, transparent 76%)",
          filter: "blur(26px)",
          animation: "rr-flicker 5.5s ease-in-out infinite",
        }}
      />

      {/* fileiras de poltronas em perspectiva */}
      <SeatRows />

      {/* poeira luminosa dourada flutuando no feixe */}
      <DustMotes />

      {/* chão escurecendo em direção à base */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "46%",
          background: "linear-gradient(180deg, transparent, rgba(60,18,16,.4) 50%, #07070a)",
        }}
      />
    </div>
  );
}

export default async function Home() {
  const featuredFilms = await getFeaturedFilms();

  return (
    <main style={{ background: "#0a0a0e", color: "#eeeae4", overflowX: "hidden" }}>
      <SiteNav />

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", minHeight: 660, overflow: "hidden" }}>
        <CinemaScreenScene />

        {/* vinhetas: escurecem as bordas e abrem uma zona limpa atrás do título */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 95% 88% at 50% 42%, rgba(10,10,14,0) 40%, rgba(10,10,14,.34) 72%, rgba(10,10,14,.86) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 46% 34% at 50% 52%, rgba(10,10,14,.5) 0%, rgba(10,10,14,.16) 60%, rgba(10,10,14,0) 80%)",
          }}
        />

        <div
          className={styles.heroContent}
          style={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px 13vh",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 13,
              letterSpacing: "0.42em",
              paddingLeft: "0.42em",
              textTransform: "uppercase",
              color: "#d4a017",
              marginBottom: 30,
            }}
          >
            Seu diário de cinema
          </span>
          <h1
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(86px, 15vw, 210px)",
              lineHeight: 0.86,
              letterSpacing: "0.01em",
              margin: 0,
              color: "#eeeae4",
              textShadow: "0 6px 44px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            Reel<span style={{ color: "#c0392b" }}>Rate</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(19px, 2.4vw, 29px)",
              lineHeight: 1.45,
              maxWidth: 560,
              color: "rgba(238,234,228,0.82)",
              margin: "26px 0 0",
              textShadow: "0 2px 18px rgba(0,0,0,0.8)",
            }}
          >
            Cada filme que você vê conta uma história sobre quem você é.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 42 }}>
            <button
              className={styles.ctaHeroPrimary}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#eeeae4",
                background: "#c0392b",
                border: "none",
                borderRadius: 4,
                padding: "16px 32px",
                cursor: "pointer",
                boxShadow: "0 10px 34px rgba(192,57,43,0.45)",
              }}
            >
              Comece seu diário
            </button>
            <Link
              href="/filmes"
              className={styles.ctaHeroSecondary}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#eeeae4",
                background: "rgba(10,10,14,0.25)",
                border: "1px solid rgba(238,234,228,0.42)",
                borderRadius: 4,
                padding: "16px 32px",
                textDecoration: "none",
                display: "inline-block",
                backdropFilter: "blur(2px)",
              }}
            >
              Explorar filmes
            </Link>
          </div>
        </div>

        <div
          className={styles.scrollHint}
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.34em",
              paddingLeft: "0.34em",
              color: "rgba(238,234,228,0.55)",
              textTransform: "uppercase",
            }}
          >
            Role para descobrir
          </span>
          <span style={{ fontSize: 15, color: "#d4a017", animation: "rr-bounce 1.8s ease-in-out infinite" }}>↓</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "#c0392b", padding: "14px 0", overflow: "hidden" }}>
        <div className={styles.marqueeTrack}>
          {Array.from({ length: 2 }, (_, copy) => (
            <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
              {featuredFilms.map((film) => (
                <span
                  key={`${copy}-${film.id}`}
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 13,
                    letterSpacing: 1,
                    color: "#fff",
                    padding: "0 28px",
                    textTransform: "uppercase",
                  }}
                >
                  ★ {film.title}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED FILMS */}
      <section style={{ padding: "100px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: 44,
              letterSpacing: 1,
              margin: 0,
              color: "#eeeae4",
            }}
          >
            Em destaque
          </h2>
          <Link
            href="/filmes"
            className={styles.exploreLink}
            style={{
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 14,
              color: "rgba(238,234,228,0.6)",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              paddingBottom: 2,
            }}
          >
            Ver todos os filmes →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 28,
          }}
        >
          {featuredFilms.length === 0 && (
            <p
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 14,
                color: "rgba(238,234,228,0.5)",
              }}
            >
              Não foi possível carregar os filmes em destaque agora. Tente novamente em breve.
            </p>
          )}
          {featuredFilms.map((film) => (
            <Link key={film.id} href={`/filmes/${film.id}`} style={{ display: "block", textDecoration: "none" }}>
              <MovieCard
                title={film.title}
                posterUrl={film.posterUrl}
                genreLabel={film.genreLabel}
                voteAverage={film.voteAverage}
                director={film.director}
                releaseDateLabel={film.releaseDateLabel}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* FILM STRIP DIVIDER */}
      <div style={{ overflow: "hidden", background: "#15100a" }}>
        <div className={styles.filmStripTrack}>
          <FilmStripFrame colors={["#1e0e0e", "#0e1825", "#1c0d15", "#0e180d"]} labels={["4", "3", "2", "1"]} />
          <FilmStripFrame colors={["#0d0d1c", "#1a180a", "#0e1318", "#1e0e0e"]} labels={["8", "7", "6", "5"]} />
          <FilmStripFrame colors={["#1e0e0e", "#0e1825", "#1c0d15", "#0e180d"]} labels={["4", "3", "2", "1"]} />
          <FilmStripFrame colors={["#0d0d1c", "#1a180a", "#0e1318", "#1e0e0e"]} labels={["8", "7", "6", "5"]} />
        </div>
      </div>

      {/* RECENT REVIEWS */}
      <section style={{ padding: "100px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 44,
            letterSpacing: 1,
            margin: "0 0 48px",
            color: "#eeeae4",
          }}
        >
          Críticas recentes
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.user}
              className={styles.reviewCard}
              style={{
                border: "1px solid rgba(238,234,228,0.08)",
                borderRadius: 8,
                padding: 24,
                background: "rgba(238,234,228,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span
                  style={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Image src={review.avatarUrl} alt={review.user} fill sizes="32px" style={{ objectFit: "cover" }} />
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-lato), sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      margin: 0,
                      color: "#eeeae4",
                    }}
                  >
                    {review.user}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: 11,
                      margin: 0,
                      color: "rgba(238,234,228,0.4)",
                    }}
                  >
                    {review.date}
                  </p>
                </div>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 600,
                  fontStyle: "italic",
                  fontSize: 17,
                  margin: "0 0 8px",
                  color: "#eeeae4",
                }}
              >
                {review.filmTitle}
              </h3>
              <div style={{ marginBottom: 10 }}>
                <RatingStars rating={review.rating} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-lato), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(238,234,228,0.65)",
                  margin: "0 0 12px",
                }}
              >
                {review.excerpt}
              </p>
              <button
                className={styles.reviewBtn}
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "rgba(238,234,228,0.5)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Ler completo →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DIARY + SIDEBAR */}
      <section
        style={{
          padding: "0 48px 100px",
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 48,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: 36,
              letterSpacing: 1,
              margin: "0 0 28px",
              color: "#eeeae4",
            }}
          >
            Diário da comunidade
          </h2>
          <div style={{ borderTop: "1px solid rgba(238,234,228,0.08)" }}>
            {diary.map((entry) => (
              <div
                key={`${entry.day}-${entry.title}`}
                className={styles.diaryEntry}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "16px 8px",
                  borderBottom: "1px solid rgba(238,234,228,0.08)",
                }}
              >
                <div style={{ textAlign: "center", width: 44, flexShrink: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-bebas), sans-serif",
                      fontSize: 22,
                      margin: 0,
                      color: "#eeeae4",
                    }}
                  >
                    {entry.day}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: 10,
                      letterSpacing: 1,
                      margin: 0,
                      color: "rgba(238,234,228,0.4)",
                    }}
                  >
                    {entry.month}
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 600,
                      fontSize: 16,
                      margin: 0,
                      color: "#eeeae4",
                    }}
                  >
                    {entry.title}{" "}
                    <span style={{ color: "rgba(238,234,228,0.4)", fontWeight: 400, fontSize: 14 }}>
                      ({entry.year})
                    </span>
                  </p>
                  {entry.rewatch && (
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        color: "#d4a017",
                      }}
                    >
                      reassistido
                    </span>
                  )}
                </div>
                <RatingStars rating={entry.rating} />
              </div>
            ))}
          </div>
        </div>

        <aside>
          <h2
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: 36,
              letterSpacing: 1,
              margin: "0 0 28px",
              color: "#eeeae4",
            }}
          >
            Listas populares
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {lists.map((list) => (
              <div
                key={list.title}
                className={styles.listItem}
                style={{
                  border: "1px solid rgba(238,234,228,0.08)",
                  borderRadius: 8,
                  padding: 18,
                  cursor: "pointer",
                }}
              >
                <p
                  className={styles.listItemTitle}
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 600,
                    fontSize: 16,
                    margin: "0 0 6px",
                    color: "#eeeae4",
                  }}
                >
                  {list.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 11,
                    margin: 0,
                    color: "rgba(238,234,228,0.45)",
                  }}
                >
                  {list.count} filmes · por {list.curator}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

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
        <span
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 20,
            color: "rgba(238,234,228,0.6)",
          }}
        >
          Reel<span style={{ color: "#c0392b" }}>Rate</span>
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {["Sobre", "Privacidade", "Termos", "Contato"].map((item) => (
            <a
              key={item}
              href="#"
              className={styles.footerLink}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 13,
                color: "rgba(238,234,228,0.45)",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
