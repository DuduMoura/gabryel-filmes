import Image from "next/image";
import styles from "./page.module.css";
import {
  getMovieDirector,
  getPosterUrl,
  getTopVotedMovies,
  type TmdbMovieWithCredits,
} from "@/lib/tmdb";

type Seat = { x: number; y: number; w: number; h: number; rx: number; grad: string };

function generateSeats(): Seat[] {
  const rows = [
    { y: 514, h: 24, w: 52, gap: 8, count: 13, grad: "seat0" },
    { y: 558, h: 28, w: 60, gap: 10, count: 13, grad: "seat1" },
    { y: 612, h: 34, w: 70, gap: 11, count: 12, grad: "seat2" },
    { y: 674, h: 40, w: 82, gap: 13, count: 11, grad: "seat3" },
    { y: 748, h: 48, w: 96, gap: 15, count: 10, grad: "seat4" },
  ];

  const seats: Seat[] = [];
  rows.forEach((row) => {
    const spacing = row.w + row.gap;
    const totalWidth = row.count * spacing - row.gap;
    const startX = 720 - Math.round(totalWidth / 2);
    for (let i = 0; i < row.count; i++) {
      const x = startX + i * spacing;
      seats.push({
        x,
        y: row.y - row.h,
        w: row.w,
        h: row.h,
        rx: Math.round(row.h * 0.4),
        grad: row.grad,
      });
    }
  });
  return seats;
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
  avatarColor: string;
};

const reviews: Review[] = [
  {
    user: "marina.cine",
    filmTitle: "A Sombra do Projetor",
    rating: "4.5",
    excerpt: "Um estudo silencioso sobre memória e perda. A fotografia carrega cada cena com um peso quase físico.",
    date: "há 2 dias",
    avatarColor: "#c0392b",
  },
  {
    user: "joaopedro_filmes",
    filmTitle: "O Último Rolo",
    rating: "5.0",
    excerpt: "Não esperava ser surpreendido assim. O terceiro ato muda tudo o que você pensava sobre os personagens.",
    date: "há 3 dias",
    avatarColor: "#d4a017",
  },
  {
    user: "luisa_assiste",
    filmTitle: "Luzes de Outubro",
    rating: "4.0",
    excerpt: "Romance sem pressa, construído em pequenos gestos. A trilha sonora faz todo o trabalho emocional.",
    date: "há 5 dias",
    avatarColor: "#2f4a7a",
  },
  {
    user: "bernardo.rolo",
    filmTitle: "Negativo",
    rating: "3.5",
    excerpt: "Tensão bem construída na primeira hora, mas perde força no final. Ainda assim, valioso pela atmosfera.",
    date: "há 6 dias",
    avatarColor: "#1f1f24",
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

function CinemaHallSVG() {
  const seats = generateSeats();

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="seat0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5e1818" />
          <stop offset="100%" stopColor="#2e0808" />
        </linearGradient>
        <linearGradient id="seat1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#641c1c" />
          <stop offset="100%" stopColor="#330a0a" />
        </linearGradient>
        <linearGradient id="seat2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c2020" />
          <stop offset="100%" stopColor="#380c0c" />
        </linearGradient>
        <linearGradient id="seat3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#742424" />
          <stop offset="100%" stopColor="#3d0e0e" />
        </linearGradient>
        <linearGradient id="seat4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c2828" />
          <stop offset="100%" stopColor="#421010" />
        </linearGradient>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0e" stopOpacity={0} />
          <stop offset="100%" stopColor="#0a0a0e" stopOpacity={1} />
        </linearGradient>
      </defs>

      <rect width={1440} height={900} fill="#0a0a0e" />
      <rect x={0} y={0} width={1440} height={56} fill="#0d0d12" />

      <ellipse cx={192} cy={2} rx={90} ry={52} fill="rgba(255,248,220,0.13)" />
      <circle cx={192} cy={16} r={5} fill="#fffce8" />
      <ellipse cx={480} cy={2} rx={66} ry={40} fill="rgba(255,248,220,0.07)" />
      <circle cx={480} cy={14} r={3.5} fill="#fffce8" style={{ opacity: 0.7 }} />
      <ellipse cx={720} cy={2} rx={96} ry={58} fill="rgba(255,248,220,0.15)" />
      <circle cx={720} cy={16} r={6} fill="#fffce8" />
      <ellipse cx={960} cy={2} rx={66} ry={40} fill="rgba(255,248,220,0.07)" />
      <circle cx={960} cy={14} r={3.5} fill="#fffce8" style={{ opacity: 0.7 }} />
      <ellipse cx={1248} cy={2} rx={90} ry={52} fill="rgba(255,248,220,0.13)" />
      <circle cx={1248} cy={16} r={5} fill="#fffce8" />

      <rect x={100} y={68} width={1240} height={388} rx={20} fill="#ebe0c8" style={{ opacity: 0.03 }} />
      <rect x={128} y={82} width={1184} height={362} rx={12} fill="#f0e8d2" style={{ opacity: 0.04 }} />
      <rect x={146} y={92} width={1148} height={342} rx={6} fill="#f5f0e0" style={{ opacity: 0.06 }} />

      <rect x={154} y={100} width={1132} height={314} fill="#f5f0ea" className={styles.cinemaScreen} />
      <rect x={154} y={100} width={1132} height={3} fill="rgba(255,255,255,0.7)" />
      <rect x={154} y={100} width={1132} height={314} fill="none" stroke="rgba(120,100,80,0.25)" strokeWidth={3} />

      <rect x={0} y={414} width={1440} height={486} fill="#0a0a0e" />

      <g className={styles.seatGroup}>
        {seats.map((seat, i) => (
          <rect
            key={i}
            x={seat.x}
            y={seat.y}
            width={seat.w}
            height={seat.h}
            rx={seat.rx}
            fill={`url(#${seat.grad})`}
          />
        ))}
      </g>

      <rect x={0} y={720} width={1440} height={180} fill="url(#bottomFade)" />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <span style={{ color: filled ? "#d4a017" : "rgba(212,160,23,0.25)", fontSize: "0.85em" }}>★</span>
  );
}

function RatingStars({ rating }: { rating: string }) {
  const value = parseFloat(rating);
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i + 1 <= Math.round(value)} />
      ))}
    </span>
  );
}

export default async function Home() {
  const featuredFilms = await getFeaturedFilms();

  return (
    <main style={{ background: "#0a0a0e", color: "#eeeae4", overflowX: "hidden" }}>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          background: "linear-gradient(to bottom, rgba(10,10,14,0.97) 0%, rgba(10,10,14,0) 100%)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 28,
            letterSpacing: 1,
            color: "#eeeae4",
          }}
        >
          Reel<span style={{ color: "#c0392b" }}>Rate</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {["Filmes", "Diário", "Listas", "Comunidade"].map((item) => (
            <a
              key={item}
              href="#"
              className={styles.navLink}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 14,
                color: "rgba(238,234,228,0.7)",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
          <button
            className={styles.ctaPrimary}
            style={{
              fontFamily: "var(--font-lato), sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
              background: "#c0392b",
              border: "none",
              borderRadius: 4,
              padding: "10px 22px",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden" }}>
        <CinemaHallSVG />
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
            padding: "0 24px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(238,234,228,0.55)",
              marginBottom: 18,
            }}
          >
            Seu Diário de Cinema · Your Film Diary
          </span>
          <h1
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(56px, 9vw, 128px)",
              lineHeight: 1,
              letterSpacing: 1,
              margin: 0,
              color: "#eeeae4",
              textShadow: "0 8px 40px rgba(0,0,0,0.6)",
            }}
          >
            Reel<span style={{ color: "#c0392b" }}>Rate</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontSize: 20,
              maxWidth: 520,
              color: "rgba(238,234,228,0.78)",
              marginTop: 22,
              marginBottom: 36,
            }}
          >
            Cada filme que você vê conta uma história sobre quem você é.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className={styles.ctaHeroPrimary}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                background: "#c0392b",
                border: "none",
                borderRadius: 4,
                padding: "16px 36px",
                cursor: "pointer",
              }}
            >
              Comece seu diário
            </button>
            <button
              className={styles.ctaHeroSecondary}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#eeeae4",
                background: "transparent",
                border: "1px solid rgba(238,234,228,0.35)",
                borderRadius: 4,
                padding: "16px 36px",
                cursor: "pointer",
              }}
            >
              Explorar filmes
            </button>
          </div>
        </div>
        <div
          className={styles.scrollHint}
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 11,
            letterSpacing: 2,
            color: "rgba(238,234,228,0.45)",
            textTransform: "uppercase",
          }}
        >
          Role para descobrir ↓
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
          <a
            href="#"
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
          </a>
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
            <div key={film.id} className={styles.filmCard} style={{ cursor: "pointer" }}>
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
                {film.genreLabel && (
                  <span
                    style={{
                      position: "absolute",
                      left: 16,
                      bottom: 16,
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: 11,
                      color: "#eeeae4",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      background: "rgba(10,10,14,0.65)",
                      padding: "4px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {film.genreLabel}
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
              {film.director && (
                <p
                  style={{
                    fontFamily: "var(--font-lato), sans-serif",
                    fontSize: 13,
                    color: "rgba(238,234,228,0.5)",
                    margin: "0 0 2px",
                  }}
                >
                  Dirigido por {film.director}
                </p>
              )}
              {film.releaseDateLabel && (
                <p
                  style={{
                    fontFamily: "var(--font-lato), sans-serif",
                    fontSize: 13,
                    color: "rgba(238,234,228,0.5)",
                    margin: "0 0 8px",
                  }}
                >
                  {film.releaseDateLabel}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <RatingStars rating={(film.voteAverage / 2).toFixed(1)} />
                <span
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 12,
                    color: "#d4a017",
                  }}
                >
                  {film.voteAverage.toFixed(1)}/10
                </span>
              </div>
            </div>
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
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: review.avatarColor,
                    flexShrink: 0,
                  }}
                />
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
