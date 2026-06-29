"use client";

import { useState } from "react";
import styles from "@/app/comunidade/comunidade.module.css";

const TABS = [
  { key: "geral", label: "Geral" },
  { key: "amigos", label: "Amigos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ComunidadeFeed() {
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
        <p
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 20,
            letterSpacing: 0.5,
            color: "#eeeae4",
            margin: 0,
          }}
        >
          Ainda não há nada por aqui
        </p>
        <p
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 14,
            color: "rgba(238,234,228,0.55)",
            margin: 0,
            maxWidth: 420,
          }}
        >
          O feed de críticas da comunidade está em construção. Em breve você verá aqui suas avaliações, as dos seus
          amigos e de outros usuários da plataforma.
        </p>
      </div>
    </div>
  );
}
