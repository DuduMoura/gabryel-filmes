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

const RATING_LABELS: Record<number, string> = {
  1: "Péssimo",
  2: "Ruim",
  3: "Regular",
  4: "Bom",
  5: "Excelente",
};

const COMMENT_MAX_LENGTH = 2000;

export function ReviewForm({ tmdbMovieId, reviewId, initialRating = 0, initialComment = "" }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        router.push(`/filmes/${tmdbMovieId}`);
      }, 900);
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      setError("Erro inesperado. Tente novamente.");
      setSubmitting(false);
    }
  }

  const displayRating = hoverRating || rating;

  if (success) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
          padding: "64px 24px",
          borderRadius: 12,
          border: "1px solid rgba(212,160,23,0.25)",
          background: "rgba(212,160,23,0.06)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(212,160,23,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: "#d4a017",
          }}
        >
          ✓
        </div>
        <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 22, letterSpacing: 0.5, color: "#eeeae4", margin: 0 }}>
          Avaliação publicada!
        </p>
        <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 13, color: "rgba(238,234,228,0.5)", margin: 0 }}>
          Redirecionando para a página do filme...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          border: "1px solid rgba(238,234,228,0.1)",
          borderRadius: 10,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }} onMouseLeave={() => setHoverRating(0)}>
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
                  fontSize: 40,
                  padding: 0,
                  lineHeight: 1,
                  color: value <= displayRating ? "#d4a017" : "rgba(212,160,23,0.25)",
                  textShadow: value <= displayRating ? "0 0 16px rgba(212,160,23,0.5)" : "none",
                }}
              >
                ★
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 28, color: displayRating ? "#d4a017" : "rgba(238,234,228,0.3)" }}>
            {displayRating > 0 ? displayRating.toFixed(1) : "—"}
          </span>
          <span style={{ fontFamily: "var(--font-lato), sans-serif", fontWeight: 700, fontSize: 14, color: "rgba(238,234,228,0.6)" }}>
            {displayRating > 0 ? RATING_LABELS[displayRating] : "Selecione uma nota"}
          </span>
        </div>
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
        onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
        maxLength={COMMENT_MAX_LENGTH}
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
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: 11,
          color: comment.length >= COMMENT_MAX_LENGTH ? "#ff6b5a" : "rgba(238,234,228,0.35)",
          textAlign: "right",
          margin: "6px 0 16px",
        }}
      >
        {comment.length}/{COMMENT_MAX_LENGTH}
      </p>

      {error && (
        <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 13, color: "#ff6b5a", margin: "0 0 16px" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 12 }}>
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
          {submitting ? "Enviando..." : reviewId ? "Atualizar avaliação" : "Publicar avaliação"}
        </button>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => router.push(`/filmes/${tmdbMovieId}`)}
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "rgba(238,234,228,0.6)",
            background: "none",
            border: "1px solid rgba(238,234,228,0.15)",
            borderRadius: 4,
            padding: "14px 28px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
