"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import styles from "./ProfileMenu.module.css";

export function ProfileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const image = session?.user?.image ?? null;
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={styles.trigger}
        aria-label="Abrir menu de perfil"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#251515",
          border: "2px solid #0a0a0e",
          boxShadow: "0 0 0 2px #c0392b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: 18,
              color: "#eeeae4",
            }}
          >
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            minWidth: 220,
            background: "#0d0d15",
            border: "1px solid rgba(238,234,228,0.08)",
            borderRadius: 8,
            boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
            overflow: "hidden",
            zIndex: 60,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(238,234,228,0.08)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#eeeae4",
                margin: 0,
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: 12,
                color: "rgba(238,234,228,0.55)",
                margin: "2px 0 0",
              }}
            >
              {email}
            </p>
          </div>
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className={styles.menuLink}
            style={{
              display: "block",
              padding: "12px 16px",
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 14,
              color: "rgba(238,234,228,0.85)",
              textDecoration: "none",
            }}
          >
            Ver perfil
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className={styles.menuLogout}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              fontFamily: "var(--font-lato), sans-serif",
              fontSize: 14,
              color: "rgba(238,234,228,0.85)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
