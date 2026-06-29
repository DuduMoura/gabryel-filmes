"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/filmes/[id]/avaliar/avaliar.module.css";

type Props = {
  tmdbMovieId: number;
  reviewId?: string;
  initialRating?: number;
  initialComment?: string;
};

export function ReviewForm({ tmdbMovieId, reviewId, initialRating = 0, initialComment = "" }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating < 1) {
      setError("Escolha uma nota de 1 a 5 estrelas");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(reviewId ? `/api/reviews/${reviewId}` : `/api/movies/${tmdbMovieId}/reviews`, {
        method: reviewId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error?.message ?? "Não foi possível salvar sua avaliação.");
        setSubmitting(false);
        return;
      }

      router.push(`/filmes/${tmdbMovieId}`);
      router.refresh();
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      setError("Erro inesperado. Tente novamente.");
      setSubmitting(false);
    }
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }} onMouseLeave={() => setHoverRating(0)}>
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1;
          return (
            <button
              key={value}
              type="button"
              aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
              className={styles.star}
              onMouseEnter={() => setHoverRating(value)}
              onClick={() => setRating(value)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 36,
                padding: 0,
                color: value <= displayRating ? "#d4a017" : "rgba(212,160,23,0.25)",
              }}
            >
              ★
            </button>
          );
        })}
      </div>

      <label
        style={{
          display: "block",
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: 11,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "rgba(238,234,228,0.45)",
          marginBottom: 8,
        }}
      >
        Comentário (opcional)
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={2000}
        rows={6}
        placeholder="O que você achou do filme?"
        className={styles.textarea}
        style={{
          width: "100%",
          resize: "vertical",
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: 14,
          color: "#eeeae4",
          background: "rgba(238,234,228,0.03)",
          border: "1px solid rgba(238,234,228,0.15)",
          borderRadius: 6,
          padding: 14,
          marginBottom: 16,
        }}
      />

      {error && (
        <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 13, color: "#ff6b5a", margin: "0 0 16px" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={styles.submit}
        style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "#fff",
          background: "#c0392b",
          border: "none",
          borderRadius: 4,
          padding: "14px 28px",
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Enviando..." : reviewId ? "Atualizar avaliação" : "Enviar avaliação"}
      </button>
    </form>
  );
}
