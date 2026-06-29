import Image from "next/image";
import styles from "@/app/page.module.css";
import { RatingStars } from "@/components/RatingStars";

export type MovieCardProps = {
  title: string;
  posterUrl: string | null;
  genreLabel: string | null;
  rating: number;
  reviewCount: number;
  director?: string | null;
  releaseDateLabel?: string | null;
};

export function MovieCard({
  title,
  posterUrl,
  genreLabel,
  rating,
  reviewCount,
  director,
  releaseDateLabel,
}: MovieCardProps) {
  return (
    <div className={styles.filmCard} style={{ cursor: "pointer" }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "2 / 3",
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: 14,
          boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
          background: posterUrl ? "#1a1a1e" : "linear-gradient(160deg, #3a2020 0%, #0a0a0e 100%)",
        }}
      >
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 45vw, 220px"
            style={{ objectFit: "cover" }}
          />
        )}
        {genreLabel && (
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
            {genreLabel}
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
        {title}
      </h3>
      {director && (
        <p
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 13,
            color: "rgba(238,234,228,0.5)",
            margin: "0 0 2px",
          }}
        >
          Dirigido por {director}
        </p>
      )}
      {releaseDateLabel && (
        <p
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 13,
            color: "rgba(238,234,228,0.5)",
            margin: "0 0 8px",
          }}
        >
          {releaseDateLabel}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <RatingStars rating={String(rating)} />
        <span
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: 12,
            color: reviewCount > 0 ? "#d4a017" : "rgba(238,234,228,0.4)",
          }}
        >
          {reviewCount > 0 ? `${rating.toFixed(1)}/5` : "Sem avaliações"}
        </span>
      </div>
    </div>
  );
}
