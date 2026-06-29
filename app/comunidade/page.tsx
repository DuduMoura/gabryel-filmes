import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireUserSession } from "@/lib/session";
import { SiteNav } from "@/components/SiteNav";
import { ComunidadeFeed } from "@/components/ComunidadeFeed";

export const metadata: Metadata = {
  title: "Comunidade · ReelRate",
};

export default async function ComunidadePage() {
  const session = await requireUserSession();
  if (!session) redirect("/login?callbackUrl=/comunidade");

  return (
    <div style={{ background: "#0a0a0e", minHeight: "100vh" }}>
      <SiteNav active="comunidade" />

      <header
        style={{
          paddingTop: 140,
          paddingBottom: 40,
          paddingLeft: 48,
          paddingRight: 48,
          background: "linear-gradient(180deg, rgba(192,57,43,0.12) 0%, rgba(10,10,14,0) 70%)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 40,
            letterSpacing: 1,
            color: "#eeeae4",
            margin: 0,
          }}
        >
          Comunidade
        </h1>
        <p
          style={{
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 14,
            color: "rgba(238,234,228,0.55)",
            margin: "8px 0 0",
          }}
        >
          Acompanhe as críticas dos seus amigos e de outros usuários da plataforma.
        </p>
      </header>

      <main style={{ padding: "0 48px 80px", maxWidth: 720 }}>
        <ComunidadeFeed />
      </main>
    </div>
  );
}
