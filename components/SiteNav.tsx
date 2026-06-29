"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "@/app/page.module.css";
import { ProfileMenu } from "@/components/ProfileMenu";

const NAV_ITEMS = [
  { key: "filmes", label: "Filmes", href: "/filmes" },
  { key: "diario", label: "Diário", href: "#" },
  { key: "listas", label: "Listas", href: "#" },
  { key: "comunidade", label: "Comunidade", href: "#" },
] as const;

export function SiteNav({ active }: { active?: "filmes" }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
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
        background: "linear-gradient(to bottom, rgba(10,10,14,0.97) 0%, rgba(10,10,14,0.85) 100%)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: 28,
          letterSpacing: 1,
          color: "#eeeae4",
          textDecoration: "none",
        }}
      >
        Reel<span style={{ color: "#c0392b" }}>Rate</span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={styles.navLink}
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 14,
                color: isActive ? "#eeeae4" : "rgba(238,234,228,0.7)",
                textDecoration: "none",
                borderBottom: isActive ? "1px solid #c0392b" : "1px solid transparent",
                paddingBottom: 4,
              }}
            >
              {item.label}
            </Link>
          );
        })}
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <Link
            href="/login"
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
              textDecoration: "none",
            }}
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
