"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/comunidade/comunidade.module.css";
import { RatingStars } from "@/components/RatingStars";

const TABS = [
  { key: "geral", label: "Geral" },
  { key: "amigos", label: "Amigos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export type FeedItem = {
  id: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  createdAtIso: string;
  movieId: number;
  movieTitle: string;
  moviePosterUrl: string | null;
  isOwn: boolean;
};

const AVATAR_PALETTE = ["#c0392b", "#2c5f6f", "#8a6d1f", "#5c4a8a", "#3d7a4a"];

function paletteColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[hash];
}

function initial(name: string): string {
  return name.charAt(0).toUpperCase() || "?";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 12,
        padding: "72px 24px",
        borderRadius: 12,
        border: "1px dashed rgba(238,234,228,0.15)",
        background: "rgba(238,234,228,0.02)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(192,57,43,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.5">
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 20, letterSpacing: 0.5, color: "#eeeae4", margin: 0 }}>
        {title}
      </p>
      <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 14, color: "rgba(238,234,228,0.55)", margin: 0, maxWidth: 420 }}>
        {description}
      </p>
    </div>
  );
}

function ReviewCard({ item }: { item: FeedItem }) {
  return (
    <article
      className={styles.card}
      style={{
        display: "flex",
        gap: 16,
        padding: 20,
        borderRadius: 10,
        border: "1px solid rgba(238,234,228,0.08)",
        background: "rgba(238,234,228,0.02)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          flexShrink: 0,
          overflow: "hidden",
          background: paletteColor(item.userName),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.userAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar pode ser um arquivo estático pré-definido
          <img src={item.userAvatarUrl} alt={item.userName} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 16, color: "rgba(255,255,255,0.85)" }}>
            {initial(item.userName)}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
          <p style={{ fontFamily: "var(--font-lato), sans-serif", fontWeight: 700, fontSize: 14, color: "#eeeae4", margin: 0 }}>
            {item.isOwn ? "Você" : item.userName}
          </p>
          <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "rgba(238,234,228,0.4)", margin: 0, flexShrink: 0 }}>
            {formatDate(item.createdAtIso)}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Link
            href={`/filmes/${item.movieId}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {item.moviePosterUrl && (
              <div style={{ position: "relative", width: 28, height: 42, borderRadius: 3, overflow: "hidden", flexShrink: 0, background: "#1a1a1e" }}>
                <Image src={item.moviePosterUrl} alt={item.movieTitle} fill sizes="28px" style={{ objectFit: "cover" }} />
              </div>
            )}
            <span style={{ fontFamily: "var(--font-lato), sans-serif", fontWeight: 700, fontSize: 14, color: "#eeeae4" }}>
              {item.movieTitle}
            </span>
          </Link>
          <RatingStars rating={String(item.rating)} />
        </div>

        {item.comment ? (
          <p
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(238,234,228,0.7)",
              margin: 0,
            }}
          >
            “{item.comment}”
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function ComunidadeFeed({ items }: { items: FeedItem[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("geral");

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 28,
          borderBottom: "1px solid rgba(238,234,228,0.1)",
          marginBottom: 32,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={styles.tab}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: isActive ? "#eeeae4" : "rgba(238,234,228,0.55)",
                borderBottom: isActive ? "2px solid #c0392b" : "2px solid transparent",
                padding: "0 0 12px",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "geral" ? (
        items.length === 0 ? (
          <EmptyState
            title="Ainda não há críticas na comunidade"
            description="Seja o primeiro a avaliar um filme! Suas críticas e as de outros usuários da plataforma aparecerão aqui."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((item) => (
              <ReviewCard key={item.id} item={item} />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          title="Funcionalidade de amigos em breve"
          description="Ainda não é possível seguir outros usuários. Quando o sistema de amigos estiver disponível, as críticas deles aparecerão aqui."
        />
      )}
    </div>
  );
}
