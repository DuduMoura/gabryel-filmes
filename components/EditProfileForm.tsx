"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AVATAR_OPTIONS } from "@/lib/avatars";
import styles from "./EditProfileForm.module.css";

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontFamily: "var(--font-lato), sans-serif",
  fontSize: 13,
  color: "rgba(238,234,228,0.7)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 6,
  border: "1px solid rgba(238,234,228,0.15)",
  background: "rgba(238,234,228,0.03)",
  color: "#eeeae4",
  fontFamily: "var(--font-lato), sans-serif",
  fontSize: 14,
};

export function EditProfileForm({
  initialName,
  initialAvatarUrl,
}: {
  initialName: string;
  initialAvatarUrl: string;
}) {
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const initial = name.charAt(0).toUpperCase() || "?";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message ?? "Não foi possível salvar as alterações");
        setLoading(false);
        return;
      }

      await update({ name: data.name, image: data.avatarUrl });
      router.push("/perfil");
      router.refresh();
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
      console.error("Falha ao atualizar perfil:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 420 }}>
      <div>
        <label style={labelStyle}>Foto de perfil</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <button
            type="button"
            onClick={() => setAvatarUrl("")}
            className={styles.avatarOption}
            aria-label="Sem foto"
            aria-pressed={avatarUrl === ""}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#251515",
              border: "3px solid #0a0a0e",
              boxShadow: avatarUrl === "" ? "0 0 0 2px #c0392b" : "0 0 0 2px transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: 22, color: "#eeeae4" }}>
              {initial}
            </span>
          </button>
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAvatarUrl(option)}
              className={styles.avatarOption}
              aria-label="Selecionar avatar"
              aria-pressed={avatarUrl === option}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "3px solid #0a0a0e",
                boxShadow: avatarUrl === option ? "0 0 0 2px #c0392b" : "0 0 0 2px transparent",
                overflow: "hidden",
                padding: 0,
                cursor: "pointer",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Image src={option} alt="" fill style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          style={inputStyle}
          required
          minLength={2}
          maxLength={80}
        />
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: 13, color: "#ff7b72", margin: 0 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="submit"
          disabled={loading}
          className={styles.saveBtn}
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#fff",
            background: "#c0392b",
            border: "none",
            borderRadius: 4,
            padding: "10px 22px",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
        <Link
          href="/perfil"
          className={styles.cancelLink}
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 14,
            color: "rgba(238,234,228,0.6)",
            textDecoration: "none",
          }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
